import ImageKit from "imagekit";
import sharp from "sharp";
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

// WebP output settings: max 1920px wide (enough for the 800px article column on 2x screens),
// quality 80 with the slowest/best encoder effort keeps text & diagrams crisp at a fraction of the size.
const WEBP_MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

/**
 * Converts an uploaded image (multipart field "image") to an optimized WebP with sharp,
 * then stores it in ImageKit under /srikode. Protected by admin authentication.
 */
export const convertAndUploadImage = async (req, res) => {
  try {
    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message: "ImageKit service not configured on the server."
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file received." });
    }

    const { data: webpBuffer, info } = await sharp(req.file.buffer)
      .rotate() // respect EXIF orientation from phone photos
      .resize({ width: WEBP_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
      .toBuffer({ resolveWithObject: true });

    const baseName = (req.file.originalname || "image")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .slice(0, 80) || "image";

    const uploaded = await imagekit.upload({
      file: webpBuffer,
      fileName: `${baseName}.webp`,
      folder: "/srikode",
      useUniqueFileName: true
    });

    return res.status(200).json({
      success: true,
      url: uploaded.url,
      width: info.width,
      height: info.height,
      originalSize: req.file.size,
      size: info.size
    });
  } catch (error) {
    logger.error(`convertAndUploadImage error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Image conversion or upload failed."
    });
  }
};
