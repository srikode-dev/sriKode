import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Contact from "../models/Contact.js";
import logger from "../config/logger.js";

/**
 * Admin: Get aggregated dashboard analytics
 */
export const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Gather counts & sums in parallel
    const [
      totalBlogs,
      publishedBlogs,
      totalComments,
      pendingComments,
      unreadContacts,
      recentContacts,
      recentComments,
      popularPosts
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Comment.countDocuments(),
      Comment.countDocuments({ isApproved: false }),
      Contact.countDocuments({ isRead: false }),
      
      // Top 5 recent contact messages
      Contact.find({})
        .select("name subject email isRead createdAt")
        .sort({ createdAt: -1 })
        .limit(5),

      // Top 5 recent comments with populated parent blog info
      Comment.find({})
        .populate("blogId", "title slug")
        .sort({ createdAt: -1 })
        .limit(5),

      // Top 5 popular blogs by views
      Blog.find({})
        .select("title slug viewCount category isPublished createdAt")
        .sort({ viewCount: -1 })
        .limit(5)
    ]);

    const draftBlogs = totalBlogs - publishedBlogs;

    // 2. Sum up total viewCounts across all blogs
    const viewStats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewCount" }
        }
      }
    ]);
    const totalViews = viewStats.length > 0 ? viewStats[0].totalViews : 0;

    // 3. Group posts count per category
    const categoryStats = await Blog.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        summary: {
          totalBlogs,
          publishedBlogs,
          draftBlogs,
          totalViews,
          totalComments,
          pendingComments,
          unreadContacts
        },
        popularPosts,
        categories: categoryStats.map(c => ({
          name: c._id || "Uncategorized",
          count: c.count
        })),
        recentActivity: {
          comments: recentComments,
          contacts: recentContacts
        }
      }
    });
  } catch (error) {
    logger.error(`getAdminAnalytics error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server Error during analytics aggregation"
    });
  }
};
