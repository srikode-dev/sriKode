import resend from "../config/resend.js";
import { RESEND_FROM_EMAIL, ADMIN_EMAIL } from "../config/envConfig.js";
import logger from "../config/logger.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to render EJS templates
const renderTemplate = async (templateName, data) => {
  const templatePath = path.join(__dirname, `../templates/emails/${templateName}.ejs`);
  return await ejs.renderFile(templatePath, data);
};

/**
 * Sends a notification email to the admin when a new contact query is submitted.
 */
export const sendContactEmail = async (name, email, subject, message) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn("Resend email API key is not set. Skipping contact form email dispatch.");
      return null;
    }

    const htmlContent = await renderTemplate("contactEmail", { name, email, subject, message });

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL || "SriKode <onboarding@resend.dev>",
      to: ADMIN_EMAIL || "srikantsahu.dev@gmail.com",
      subject: `📩 SriKode Contact Query: ${subject}`,
      html: htmlContent
    });

    if (error) {
      logger.error(`Resend API response error: ${JSON.stringify(error)}`);
      return null;
    }

    logger.info(`Notification email sent to admin successfully. Email ID: ${data?.id}`);
    return data;
  } catch (error) {
    logger.error(`Resend sendContactEmail error: ${error.message}`);
    return null;
  }
};

/**
 * Sends a thank-you email to the guest commenter letting them know their comment is pending approval.
 */
export const sendCommentThankYouEmail = async (email, name, blogTitle) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn("Resend email API key is not set. Skipping guest comment thank-you email dispatch.");
      return null;
    }

    const htmlContent = await renderTemplate("commentThankYouEmail", { name, blogTitle });

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL || "SriKode <onboarding@resend.dev>",
      to: email,
      subject: `💬 Thank you for commenting on SriKode!`,
      html: htmlContent
    });

    if (error) {
      logger.error(`Resend sendCommentThankYouEmail error details: ${JSON.stringify(error)}`);
      return null;
    }

    logger.info(`Guest comment thank-you email sent to ${email}. ID: ${data?.id}`);
    return data;
  } catch (error) {
    logger.error(`Resend sendCommentThankYouEmail error: ${error.message}`);
    return null;
  }
};

/**
 * Sends a welcome email when a user subscribes to the newsletter.
 */
export const sendNewsletterWelcomeEmail = async (email) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn("Resend email API key is not set. Skipping newsletter welcome email dispatch.");
      return null;
    }

    const htmlContent = await renderTemplate("newsletterWelcomeEmail", {});

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL || "SriKode <onboarding@resend.dev>",
      to: email,
      subject: `🚀 Welcome to the SriKode Newsletter!`,
      html: htmlContent
    });

    if (error) {
      logger.error(`Resend sendNewsletterWelcomeEmail error details: ${JSON.stringify(error)}`);
      return null;
    }

    logger.info(`Newsletter welcome email sent to: ${email}. ID: ${data?.id}`);
    return data;
  } catch (error) {
    logger.error(`Resend sendNewsletterWelcomeEmail error: ${error.message}`);
    return null;
  }
};

/**
 * Sends an email notification to all active subscribers when a new blog is published.
 */
export const sendNewBlogNotificationEmail = async (blogTitle, blogSlug, bccEmailsArray) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn("Resend email API key is not set. Skipping new blog notification dispatch.");
      return null;
    }

    if (!bccEmailsArray || bccEmailsArray.length === 0) return null;

    const blogUrl = `https://sri-kode.vercel.app/blogs/${blogSlug}`;
    const htmlContent = await renderTemplate("newBlogNotificationEmail", { blogTitle, blogUrl });

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL || "SriKode <onboarding@resend.dev>",
      to: ADMIN_EMAIL || "srikantsahu.dev@gmail.com", 
      bcc: bccEmailsArray, 
      subject: `✨ New Blog Post: ${blogTitle}`,
      html: htmlContent
    });

    if (error) {
      logger.error(`Resend sendNewBlogNotificationEmail error details: ${JSON.stringify(error)}`);
      return null;
    }

    logger.info(`New blog notification email sent to ${bccEmailsArray.length} subscribers. ID: ${data?.id}`);
    return data;
  } catch (error) {
    logger.error(`Resend sendNewBlogNotificationEmail error: ${error.message}`);
    return null;
  }
};
