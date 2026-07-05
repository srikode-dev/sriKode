import ImageKit from "imagekit";
import { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } from "../config/envConfig.js";
import logger from "../config/logger.js";

let imagekit = null;

// Initialize ImageKit instance only if env keys are present
try {
  if (IMAGEKIT_PUBLIC_KEY && IMAGEKIT_PRIVATE_KEY && IMAGEKIT_URL_ENDPOINT) {
    imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT
    });
  } else {
    logger.warn("ImageKit variables are missing from environment config. Image uploads will fail.");
  }
} catch (error) {
  logger.error(`Error initializing ImageKit SDK: ${error.message}`);
}

/**
 * Generate authentication parameters for client-side uploads directly to ImageKit CDN.
 * Protected by admin authentication.
 */
export const getImageKitAuthParams = (req, res) => {
  try {
    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message: "ImageKit service not configured on the server."
      });
    }

    const authParams = imagekit.getAuthenticationParameters();
    return res.status(200).json(authParams);
  } catch (error) {
    logger.error(`getImageKitAuthParams error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
