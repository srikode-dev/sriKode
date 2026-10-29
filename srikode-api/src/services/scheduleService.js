import Blog from "../models/Blog.js";
import Subscriber from "../models/Subscriber.js";
import logger from "../config/logger.js";
import { sendNewBlogNotificationEmail } from "./resendService.js";

// Vercel has no long-running process, so due posts are published lazily on public reads.
// Throttle the DB check so busy traffic doesn't run it on every request.
const CHECK_INTERVAL_MS = 30 * 1000;
let lastCheckAt = 0;
let runningCheck = null;

const notifySubscribers = (blog) => {
  Subscriber.find({ isActive: true })
    .then(subscribers => {
      const emails = subscribers.map(sub => sub.email);
      if (emails.length > 0) {
        sendNewBlogNotificationEmail(blog.title, blog.slug, emails);
      }
    })
    .catch(err => logger.error(`Scheduled publish email notification error: ${err.message}`));
};

/**
 * Publishes every draft whose scheduledAt time has passed.
 * Each post is flipped with an atomic conditional update, so concurrent instances
 * can never publish (or email subscribers about) the same post twice.
 */
export const publishDueScheduledBlogs = async () => {
  const now = new Date();
  const due = await Blog.find({ isPublished: false, scheduledAt: { $ne: null, $lte: now } })
    .select("_id scheduledAt")
    .lean();

  let published = 0;
  for (const { _id, scheduledAt } of due) {
    // Native driver update: mongoose treats createdAt as immutable, but the post's
    // public date and feed position should be its actual go-live time.
    const result = await Blog.collection.findOneAndUpdate(
      { _id, isPublished: false, scheduledAt: { $lte: now } },
      { $set: { isPublished: true, scheduledAt: null, createdAt: scheduledAt, updatedAt: now } },
      { returnDocument: "after", projection: { title: 1, slug: 1 } }
    );
    const blog = result?.value !== undefined ? result.value : result;
    if (blog) {
      published++;
      logger.info(`Scheduled blog published: "${blog.title}" (slug: ${blog.slug})`);
      notifySubscribers(blog);
    }
  }
  return published;
};

/**
 * Throttled wrapper used by the public-route middleware and the local interval.
 */
export const checkScheduledBlogs = async ({ force = false } = {}) => {
  if (!force && Date.now() - lastCheckAt < CHECK_INTERVAL_MS) return;
  if (runningCheck) return runningCheck;

  lastCheckAt = Date.now();
  runningCheck = publishDueScheduledBlogs()
    .catch(err => logger.error(`Scheduled publish check failed: ${err.message}`))
    .finally(() => { runningCheck = null; });
  return runningCheck;
};

/**
 * Express middleware for public blog routes: publish due posts before serving the read.
 */
export const publishScheduledMiddleware = async (req, res, next) => {
  await checkScheduledBlogs();
  next();
};
