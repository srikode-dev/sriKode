import Blog from "../models/Blog.js";
import logger from "../config/logger.js";

// Helper to slugify a string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")         // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start
    .replace(/-+$/, "");            // Trim - from end
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
 */
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, isPublished: true })
      .populate({
        path: "relatedPosts",
        match: { isPublished: true },
        select: "title slug coverImage excerpt category readingTime createdAt"
      });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Increment viewCount asynchronously
    blog.viewCount += 1;
    await blog.save();

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
      .select("title slug category isPublished isFeatured viewCount readingTime createdAt")
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
 * Admin: Create a new blog draft
 */
export const createBlogAdmin = async (req, res) => {
  try {
    const { title, excerpt, category } = req.body;

    if (!title || !excerpt || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt, and category are required to create a draft"
      });
    }

    // Auto-generate a unique slug from title
    let slug = slugify(title);
    let slugExists = await Blog.findOne({ slug });
    let counter = 1;
    
    while (slugExists) {
      slug = `${slugify(title)}-${counter}`;
      slugExists = await Blog.findOne({ slug });
      counter++;
    }

    const blogData = {
      ...req.body,
      slug,
      isPublished: false,
      tableOfContents: generateTableOfContents(req.body.content || [])
    };

    const newBlog = await Blog.create(blogData);

    logger.info(`New blog draft created: "${newBlog.title}" (slug: ${newBlog.slug})`);

    return res.status(201).json({
      success: true,
      message: "Blog draft created successfully",
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

    // If title is changing, auto-update slug (only if it is a draft to avoid breaking SEO on published links, or manually override)
    if (updateData.title && updateData.title !== blog.title && !blog.isPublished) {
      let slug = slugify(updateData.title);
      let slugExists = await Blog.findOne({ slug, _id: { $ne: id } });
      let counter = 1;

      while (slugExists) {
        slug = `${slugify(updateData.title)}-${counter}`;
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

    logger.info(`Blog updated by admin: "${updatedBlog.title}"`);

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
