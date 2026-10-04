import SiteConfig from "../models/SiteConfig.js";
import Blog from "../models/Blog.js";
import Subscriber from "../models/Subscriber.js";
import logger from "../config/logger.js";

/**
 * Helper to compute live stats directly from the MongoDB database
 */
const computeLiveStats = async () => {
  try {
    const liveTutorials = await Blog.countDocuments({ isPublished: true });
    
    const viewsAgg = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, totalViews: { $sum: "$viewCount" } } }
    ]);
    const totalViews = viewsAgg[0]?.totalViews || 0;
    
    const liveSubscribers = await Subscriber.countDocuments({ isActive: true });

    let readerValue = totalViews;
    let readerSuffix = "+";
    if (totalViews >= 1000000) {
      readerValue = Number((totalViews / 1000000).toFixed(1));
      readerSuffix = "M+";
    } else if (totalViews >= 1000) {
      readerValue = Number((totalViews / 1000).toFixed(1));
      readerSuffix = "K+";
    }

    return [
      { value: liveTutorials, label: "Live Tutorials", suffix: "+" },
      { value: readerValue || 1, label: "Readers & Visits", suffix: readerSuffix },
      { value: Math.max(liveSubscribers, 50), label: "Community Members", suffix: "+" },
      { value: 5, label: "Years Exp", suffix: "+" },
    ];
  } catch (err) {
    logger.error(`Error computing live stats: ${err.message}`);
    return null;
  }
};

/**
 * Public & Admin: Get current CMS sections configuration (with live stats computation)
 */
export const getCmsConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne({ key: "default" });

    // If never initialized, create with schema defaults
    if (!config) {
      config = await SiteConfig.create({ key: "default" });
    }

    const liveStats = await computeLiveStats();

    // If real-time stats are enabled, override active stats with live computed values
    const configObj = config.toObject();
    if (configObj.useRealtimeStats && liveStats) {
      configObj.stats = liveStats;
    }

    return res.status(200).json({
      success: true,
      config: configObj,
      liveStats: liveStats || configObj.stats,
    });
  } catch (error) {
    logger.error(`getCmsConfig error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error fetching CMS configuration",
    });
  }
};

/**
 * Admin: Update CMS sections, sponsor slots, and theme settings
 */
export const updateCmsConfig = async (req, res) => {
  try {
    const { 
      stats, 
      useRealtimeStats, 
      sponsors, 
      socialCard, 
      newsletter, 
      about, 
      contact, 
      theme 
    } = req.body;

    const updatePayload = {};
    if (stats !== undefined) updatePayload.stats = stats;
    if (useRealtimeStats !== undefined) updatePayload.useRealtimeStats = useRealtimeStats;
    if (sponsors !== undefined) updatePayload.sponsors = sponsors;
    if (socialCard !== undefined) updatePayload.socialCard = socialCard;
    if (newsletter !== undefined) updatePayload.newsletter = newsletter;
    if (about !== undefined) updatePayload.about = about;
    if (contact !== undefined) updatePayload.contact = contact;
    if (theme !== undefined) updatePayload.theme = theme;

    const config = await SiteConfig.findOneAndUpdate(
      { key: "default" },
      { $set: updatePayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const liveStats = await computeLiveStats();
    const configObj = config.toObject();
    if (configObj.useRealtimeStats && liveStats) {
      configObj.stats = liveStats;
    }

    return res.status(200).json({
      success: true,
      message: "CMS configuration saved successfully",
      config: configObj,
      liveStats: liveStats || configObj.stats,
    });
  } catch (error) {
    logger.error(`updateCmsConfig error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error updating CMS configuration",
    });
  }
};
