import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";
import logger from "../config/logger.js";
import { sendCommentThankYouEmail } from "../services/resendService.js";

/**
 * Public: Get approved comments for a specific blog by slug
 */
export const getCommentsByBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, isPublished: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const comments = await Comment.find({ blogId: blog._id, isApproved: true })
      .select("-email") // Do not leak guest email addresses to public API
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    logger.error(`getCommentsByBlog error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Public: Submit a guest comment for moderation
 */
export const submitComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, email, text } = req.body;

    if (!name || !email || !text) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and comment text are required"
      });
    }

    const blog = await Blog.findOne({ slug, isPublished: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const newComment = await Comment.create({
      blogId: blog._id,
      name,
      email,
      text,
      isApproved: false // Always default to false for admin review
    });

    logger.info(`New guest comment submitted on blog: "${blog.title}" by ${name} (${email})`);

    // Dispatch thank you email notification asynchronously
    sendCommentThankYouEmail(email, name, blog.title);

    return res.status(201).json({
      success: true,
      message: "Comment submitted successfully! It will appear once approved by the admin.",
      comment: {
        id: newComment._id,
        name: newComment.name,
        text: newComment.text,
        createdAt: newComment.createdAt
      }
    });
  } catch (error) {
    logger.error(`submitComment error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Get all comments (pending & approved) across all blogs
 */
export const getAllCommentsAdmin = async (req, res) => {
  try {
    const { approved } = req.query;

    const query = {};
    if (approved !== undefined) {
      query.isApproved = approved === "true";
    }

    const comments = await Comment.find(query)
      .populate({
        path: "blogId",
        select: "title slug"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    logger.error(`getAllCommentsAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Approve/Reject comment
 */
export const toggleCommentApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (isApproved === undefined) {
      return res.status(400).json({
        success: false,
        message: "isApproved parameter is required"
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    comment.isApproved = isApproved;
    await comment.save();

    logger.info(`Comment by "${comment.name}" status updated to isApproved=${isApproved}`);

    return res.status(200).json({
      success: true,
      message: `Comment successfully ${isApproved ? "approved" : "unapproved"}`,
      comment
    });
  } catch (error) {
    logger.error(`toggleCommentApproval error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Delete a comment
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    await Comment.findByIdAndDelete(id);

    logger.info(`Comment by "${comment.name}" deleted by admin`);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    logger.error(`deleteComment error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
