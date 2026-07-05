import Video from "../models/Video.js";
import { syncYouTubeVideos } from "../services/youtubeService.js";
import logger from "../config/logger.js";

/**
 * Public: Get all non-hidden cached videos
 */
export const getVisibleVideosPublic = async (req, res) => {
  try {
    const videos = await Video.find({ isHidden: false })
      .sort({ publishedAt: -1 });

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    logger.error(`getVisibleVideosPublic error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Get all cached videos (including hidden ones)
 */
export const getAllVideosAdmin = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ publishedAt: -1 });

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    logger.error(`getAllVideosAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Trigger synchronization with YouTube Data API
 */
export const syncVideosAdmin = async (req, res) => {
  try {
    const result = await syncYouTubeVideos();

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      success: true,
      message: `YouTube sync complete. Synced ${result.count} videos.`,
      count: result.count
    });
  } catch (error) {
    logger.error(`syncVideosAdmin controller error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Toggle the visibility of a video on the frontend
 */
export const toggleVideoHidden = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    if (isHidden === undefined) {
      return res.status(400).json({
        success: false,
        message: "isHidden property is required"
      });
    }

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    video.isHidden = isHidden;
    await video.save();

    logger.info(`Video visibility updated: "${video.title}" isHidden=${isHidden}`);

    return res.status(200).json({
      success: true,
      message: `Video successfully ${isHidden ? "hidden from" : "made visible on"} the frontend.`,
      video
    });
  } catch (error) {
    logger.error(`toggleVideoHidden error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
