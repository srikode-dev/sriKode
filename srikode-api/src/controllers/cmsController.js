import SiteConfig from "../models/SiteConfig.js";
import logger from "../config/logger.js";

/**
 * Public: Get current CMS sections configuration (with auto-initialization of defaults)
 */
export const getCmsConfig = async (req, res) => {
  try {
    let config = await SiteConfig.findOne({ key: "default" });

    // If never initialized, create with schema defaults
    if (!config) {
      config = await SiteConfig.create({ key: "default" });
    }

    return res.status(200).json({
      success: true,
      config,
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
 * Admin: Update CMS sections and theme settings
 */
export const updateCmsConfig = async (req, res) => {
  try {
    const { stats, socialCard, newsletter, about, contact, theme } = req.body;

    const updatePayload = {};
    if (stats !== undefined) updatePayload.stats = stats;
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

    return res.status(200).json({
      success: true,
      message: "CMS configuration saved successfully",
      config,
    });
  } catch (error) {
    logger.error(`updateCmsConfig error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error updating CMS configuration",
    });
  }
};
