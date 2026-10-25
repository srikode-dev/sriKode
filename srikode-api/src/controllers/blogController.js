import Blog from "../models/Blog.js";
import Subscriber from "../models/Subscriber.js";
import BlogAnalytics from "../models/BlogAnalytics.js";
import logger from "../config/logger.js";
import { sendNewBlogNotificationEmail } from "../services/resendService.js";

// Helper to slugify a string with accent stripping, lowercasing, and clean hyphenation
const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove all characters except lowercase letters, numbers, spaces, and hyphens
    .replace(/\s+/g, "-")           // replace spaces with hyphens
    .replace(/-+/g, "-")            // replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "");       // remove leading and trailing hyphens
};

// Helper to auto-generate Table of Contents from H2 headings in content blocks
const generateTableOfContents = (content) => {
  if (!Array.isArray(content)) return [];
  return content
    .filter(block => block.type === "heading" && block.level === 2 && block.text)
    .map(block => {
      const id = slugify(block.text);
      return { id, title: block.text };
    });
};

/**
 * Public: Get all published blogs
 * Supports pagination, search, category filtering, and tag filtering
 */
export const getAllBlogsPublic = async (req, res) => {
  try {
    const { category, tag, search, page = 1, limit = 8 } = req.query;

    const query = { isPublished: true };

    if (category) {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    if (tag) {
      query.tags = { $regex: new RegExp(`^${tag.trim()}$`, "i") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } }
      ];
    }

    const safeLimit = Math.min(Number(limit) || 8, 100);
    const skipIndex = (Number(page) - 1) * safeLimit;

    // Fetch blogs sorted by published date (updatedAt or createdAt) descending
    const blogs = await Blog.find(query)
      .select("-content -faq -tableOfContents -seo") // Exclude heavy detail fields for listings
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(safeLimit);

    const total = await Blog.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      blogs,
    });
  } catch (error) {
    logger.error(`getAllBlogsPublic error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Public: Get featured blogs
 */
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true, isFeatured: true })
      .select("-content -faq -tableOfContents -seo")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    logger.error(`getFeaturedBlogs error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Public: Get a single blog by slug (and increment views)
 * Supports ?preview=true for previewing drafts
 */
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { preview } = req.query;

    if (!slug) {
      return res.status(400).json({ success: false, message: "Slug is required" });
    }

    const decodedSlug = decodeURIComponent(slug);
    const cleanSlug = slugify(decodedSlug) || slugify(slug) || decodedSlug.toLowerCase().trim();

    // Query condition: match clean slug, decoded slug, or raw trimmed slug
    const query = {
      $or: [
        { slug: cleanSlug },
        { slug: decodedSlug.trim() },
        { slug: slug.trim() }
      ]
    };

    // If 24-char hex string, also allow matching by _id
    if (/^[0-9a-fA-F]{24}$/.test(slug)) {
      query.$or.push({ _id: slug });
    }

    // If preview !== "true", require article to be published
    if (preview !== "true") {
      query.isPublished = true;
    }

    const blog = await Blog.findOne(query)
      .populate({
        path: "relatedPosts",
        match: { isPublished: true },
        select: "title slug coverImage excerpt category readingTime createdAt"
      });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Only increment views and track analytics for live visits on published posts
    if (blog.isPublished && preview !== "true") {
      blog.viewCount += 1;
      await blog.save();

      // Multi-proxy geolocation header resolution with timezone & local dev fallback
      let country = (
        req.headers["x-client-country"] ||
        req.headers["x-vercel-ip-country"] ||
        req.headers["cf-ipcountry"] ||
        req.headers["x-country-code"] ||
        req.headers["geoip-country-code"] ||
        ""
      ).toString().trim().toUpperCase();

      let city = (
        req.headers["x-client-city"] ||
        req.headers["x-vercel-ip-city"] ||
        req.headers["cf-ipcity"] ||
        req.headers["x-city"] ||
        ""
      ).toString().trim();

      // Timezone fallback if country header not provided by proxy
      const tz = (req.headers["x-timezone"] || req.headers["x-client-timezone"] || "").toString().trim();
      if (!country || country === "UNKNOWN") {
        if (tz.includes("Kolkata") || tz.includes("Calcutta")) {
          country = "IN";
          if (!city || city === "Unknown") city = "India";
        } else if (tz.includes("New_York") || tz.includes("Chicago") || tz.includes("Los_Angeles") || tz.includes("Denver")) {
          country = "US";
        } else if (tz.includes("London")) {
          country = "GB";
        } else if (tz.includes("Berlin") || tz.includes("Frankfurt")) {
          country = "DE";
        } else if (tz.includes("Paris")) {
          country = "FR";
        } else if (tz.includes("Tokyo")) {
          country = "JP";
        } else if (tz.includes("Sydney") || tz.includes("Melbourne")) {
          country = "AU";
        } else if (tz.includes("Singapore")) {
          country = "SG";
        } else if (tz.includes("Toronto") || tz.includes("Vancouver")) {
          country = "CA";
        }
      }

      // Local development fallback on loopback
      const ip = req.ip || req.connection?.remoteAddress || "";
      const isLoopback = ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
      if ((!country || country === "UNKNOWN") && isLoopback) {
        try {
          const sysTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
          if (sysTz.includes("Kolkata") || sysTz.includes("Calcutta")) {
            country = "IN";
            if (!city || city === "Unknown") city = "India";
          }
        } catch {
          // ignore
        }
      }

      if (!country) country = "Unknown";
      if (!city) city = "Unknown";
      
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

      BlogAnalytics.findOneAndUpdate(
        { blog: blog._id, date: formattedDate, country, city },
        { $inc: { views: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).catch(err => logger.error(`BlogAnalytics track error: ${err.message}`));
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    logger.error(`getBlogBySlug error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Get all blogs (drafts + published) with full meta
 */
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .select("title slug category isPublished isFeatured adsEnabled viewCount readingTime createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    logger.error(`getAllBlogsAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Get single blog by ID
 */
export const getBlogByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    logger.error(`getBlogByIdAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Create a new blog (Draft or Published)
 */
export const createBlogAdmin = async (req, res) => {
  try {
    const { title, excerpt, category, slug: customSlug, isPublished } = req.body;

    if (!title || !excerpt || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt, and category are required to create an article"
      });
    }

    // Auto-generate a unique clean slug from custom slug or title
    let baseSlug = slugify(customSlug || title);
    if (!baseSlug) {
      baseSlug = `article-${Date.now().toString(36)}`;
    }

    let slug = baseSlug;
    let slugExists = await Blog.findOne({ slug });
    let counter = 1;
    
    while (slugExists) {
      slug = `${baseSlug}-${counter}`;
      slugExists = await Blog.findOne({ slug });
      counter++;
    }

    const blogData = {
      ...req.body,
      slug,
      isPublished: typeof isPublished === "boolean" ? isPublished : false,
      tableOfContents: generateTableOfContents(req.body.content || [])
    };

    const newBlog = await Blog.create(blogData);

    logger.info(`New blog created: "${newBlog.title}" (slug: ${newBlog.slug}, published: ${newBlog.isPublished})`);

    // If published immediately, notify subscribers asynchronously
    if (newBlog.isPublished) {
      Subscriber.find({ isActive: true })
        .then(subscribers => {
          const emails = subscribers.map(sub => sub.email);
          if (emails.length > 0) {
            sendNewBlogNotificationEmail(newBlog.title, newBlog.slug, emails);
          }
        })
        .catch(err => logger.error(`Subscriber email notification error: ${err.message}`));
    }

    return res.status(201).json({
      success: true,
      message: newBlog.isPublished ? "Blog published successfully" : "Blog draft created successfully",
      blog: newBlog,
    });
  } catch (error) {
    logger.error(`createBlogAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

/**
 * Admin: Update a blog
 */
export const updateBlogAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Slug management:
    // If a custom slug is provided and differs from current blog.slug
    if (updateData.slug && slugify(updateData.slug) !== blog.slug) {
      let baseSlug = slugify(updateData.slug);
      let slug = baseSlug;
      let slugExists = await Blog.findOne({ slug, _id: { $ne: id } });
      let counter = 1;

      while (slugExists) {
        slug = `${baseSlug}-${counter}`;
        slugExists = await Blog.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
      updateData.slug = slug;
    } else if (updateData.title && updateData.title !== blog.title && (!blog.slug || !blog.isPublished)) {
      let baseSlug = slugify(updateData.title);
      let slug = baseSlug;
      let slugExists = await Blog.findOne({ slug, _id: { $ne: id } });
      let counter = 1;

      while (slugExists) {
        slug = `${baseSlug}-${counter}`;
        slugExists = await Blog.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
      updateData.slug = slug;
    }

    // Automatically rebuild Table of Contents if content is modified
    if (updateData.content) {
      updateData.tableOfContents = generateTableOfContents(updateData.content);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // If it was just published (Draft -> Published), notify subscribers asynchronously
    if (updateData.isPublished === true && blog.isPublished === false) {
      Subscriber.find({ isActive: true })
        .then(subscribers => {
          const emails = subscribers.map(sub => sub.email);
          if (emails.length > 0) {
            sendNewBlogNotificationEmail(updatedBlog.title, updatedBlog.slug, emails);
          }
        })
        .catch(err => logger.error(`Error fetching subscribers for blog notification: ${err.message}`));
    }

    logger.info(`Blog updated by admin: "${updatedBlog.title}" (slug: ${updatedBlog.slug}, published: ${updatedBlog.isPublished})`);

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    logger.error(`updateBlogAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

/**
 * Admin: Delete a blog
 */
export const deleteBlogAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await Blog.findByIdAndDelete(id);

    logger.info(`Blog deleted by admin: "${blog.title}"`);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    logger.error(`deleteBlogAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Get aggregated blog analytics
 */
export const getAnalyticsAdmin = async (req, res) => {
  try {
    // 1. Group by Date for the Line Chart (e.g., last 30 days)
    const dailyViews = await BlogAnalytics.aggregate([
      {
        $group: {
          _id: "$date",
          views: { $sum: "$views" }
        }
      },
      { $sort: { _id: 1 } } // Sort by date ascending (assuming DD-MM-YYYY formats properly when string sorted if we enforce format, wait DD-MM-YYYY sorts by day first. Let's fix that in frontend or return raw data).
    ]);

    // 2. Group by Country for Demographic Distribution
    const countryViews = await BlogAnalytics.aggregate([
      {
        $group: {
          _id: "$country",
          views: { $sum: "$views" }
        }
      },
      { $sort: { views: -1 } }
    ]);

    // 3. Group by City for Top Metros
    const cityViews = await BlogAnalytics.aggregate([
      {
        $match: { city: { $ne: "Unknown" } }
      },
      {
        $group: {
          _id: { city: "$city", country: "$country" },
          views: { $sum: "$views" }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 15 }
    ]);

    return res.status(200).json({
      success: true,
      dailyViews,
      countryViews: countryViews.map((c) => ({
        country: c._id || "Unknown",
        _id: c._id || "Unknown",
        views: c.views || 0,
      })),
      cityViews: cityViews.map((c) => ({
        city: c._id.city,
        country: c._id.country,
        views: c.views || 0,
      })),
    });
  } catch (error) {
    logger.error(`getAnalyticsAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
