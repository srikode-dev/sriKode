import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from "../config/envConfig.js";
import logger from "../config/logger.js";
import Video from "../models/Video.js";

// Helper to convert YouTube ISO 8601 duration (e.g., PT15M33S) into standard mm:ss format
const formatDuration = (isoDuration) => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  const pad = (num) => num.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
};

// Helper to format YouTube view counts into readable strings (e.g., 25000 -> "25K")
const formatViews = (viewsNum) => {
  if (!viewsNum) return "0";
  const views = parseInt(viewsNum);
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K`;
  }
  return views.toString();
};

/**
 * Synchronize database with the latest public videos from YouTube channel.
 * Fetches up to 50 latest uploads and caches them in MongoDB.
 */
export const syncYouTubeVideos = async () => {
  try {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      logger.warn("YouTube integration is not configured. Sync skipped.");
      return { success: false, message: "YouTube API keys are not set in environment." };
    }

    // Standard YouTube channel uploads playlist ID is channel ID with the second char replaced with 'U'
    // E.g., UCxxxxxxxxx -> UUxxxxxxxxx
    const uploadsPlaylistId = YOUTUBE_CHANNEL_ID.replace(/^HC/, "UU").replace(/^UC/, "UU");

    logger.info(`🔄 Syncing YouTube uploads. Playlist: ${uploadsPlaylistId}`);

    // Step 1: Fetch playlist items (latest uploads)
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`;
    
    const playlistResponse = await fetch(playlistUrl);
    const playlistData = await playlistResponse.json();

    if (playlistData.error) {
      logger.error(`YouTube API PlaylistItems Error: ${JSON.stringify(playlistData.error)}`);
      return { success: false, message: playlistData.error.message };
    }

    const items = playlistData.items || [];
    if (items.length === 0) {
      return { success: true, count: 0, message: "No videos found in uploads playlist." };
    }

    // Step 2: Extract video IDs to query details (duration and views)
    const videoIds = items.map(item => item.contentDetails.videoId).join(",");

    const videosDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    const detailsResponse = await fetch(videosDetailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.error) {
      logger.error(`YouTube API Videos Details Error: ${JSON.stringify(detailsData.error)}`);
      return { success: false, message: detailsData.error.message };
    }

    const detailsList = detailsData.items || [];

    // Step 3: Write or update entries in database cache
    let upsertCount = 0;
    const now = new Date();

    for (const item of detailsList) {
      const youtubeId = item.id;
      const title = item.snippet.title;
      const description = item.snippet.description || "";
      const publishedAt = new Date(item.snippet.publishedAt);
      
      // Select best quality thumbnail available
      const thumbnails = item.snippet.thumbnails;
      const thumbnail = (thumbnails.maxres || thumbnails.standard || thumbnails.high || thumbnails.medium || thumbnails.default)?.url;

      const durationRaw = item.contentDetails.duration;
      const duration = formatDuration(durationRaw);

      const viewsRaw = item.statistics.viewCount;
      const viewCount = formatViews(viewsRaw);

      // Perform upsert (Insert if new, update fields if existing - preserving admin controls like isHidden)
      await Video.findOneAndUpdate(
        { youtubeId },
        {
          $set: {
            title,
            description,
            thumbnail,
            duration,
            viewCount,
            publishedAt,
            syncedAt: now
          }
        },
        { upsert: true, new: true }
      );
      upsertCount++;
    }

    logger.info(`✅ Successfully synced ${upsertCount} YouTube videos to MongoDB cache.`);
    return { success: true, count: upsertCount };
  } catch (error) {
    logger.error(`syncYouTubeVideos service error: ${error.message}`);
    return { success: false, message: error.message };
  }
};
