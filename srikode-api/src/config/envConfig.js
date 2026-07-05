import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const API_VERSION = process.env.API_VERSION || "v1";

// database
export const MONGO_URI = process.env.MONGO_URI;

// auth
export const JWT_SECRET = process.env.JWT_SECRET;

// cors
export const CLIENT_URLS = process.env.CLIENT_URLS?.split(",") || [];

// imagekit
export const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
export const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

// resend
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
export const APP_NAME = process.env.APP_NAME;
export const APP_URL = process.env.APP_URL;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// youtube
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;