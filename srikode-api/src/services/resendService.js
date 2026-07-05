import resend from "../config/resend.js";
import { RESEND_FROM_EMAIL, ADMIN_EMAIL } from "../config/envConfig.js";
import logger from "../config/logger.js";

/**
 * Sends a notification email to the admin when a new contact query is submitted.
 */
export const sendContactEmail = async (name, email, subject, message) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      logger.warn("Resend email API key is not set. Skipping contact form email dispatch.");
      return null;
    }

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL || "SriKode <onboarding@resend.dev>",
      to: ADMIN_EMAIL || "srikantsahu.dev@gmail.com",
      subject: `📩 SriKode Contact Query: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 0;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #d1d5db; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-bottom: 0;">This notification was generated automatically by the SriKode API server.</p>
        </div>
      `
    });

    if (error) {
      logger.error(`Resend API response error: ${JSON.stringify(error)}`);
      return null;
    }

    logger.info(`Notification email sent to admin successfully. Email ID: ${data?.id}`);
    return data;
  } catch (error) {
    logger.error(`Resend sendContactEmail error: ${error.message}`);
    // Graceful fallback: we don't crash the request if email sending fails
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

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL || "SriKode <onboarding@resend.dev>",
      to: email,
      subject: `💬 Thank you for commenting on SriKode!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 0;">Thanks for your comment, ${name}!</h2>
          <p>We appreciate you taking the time to share your thoughts on our article: <strong>"${blogTitle}"</strong>.</p>
          <p>To keep our coding community friendly and spam-free, all comments go through a quick manual check. Your comment is currently <strong>pending moderation</strong> and will appear live on the blog as soon as it is verified by the admin.</p>
          <p>Happy Coding!</p>
          <p>— The SriKode Team</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-bottom: 0;">This email was sent because you submitted a comment on <a href="https://srikantsahu.in">SriKode</a>.</p>
        </div>
      `
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

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL || "SriKode <onboarding@resend.dev>",
      to: email,
      subject: `🚀 Welcome to the SriKode Newsletter!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 0;">You're in! Welcome to SriKode.</h2>
          <p>Thank you for subscribing to our newsletter! You'll now be the first to receive updates on:</p>
          <ul>
            <li>Modern Frontend tutorials (React, Next.js, CSS layouts)</li>
            <li>Full Stack coding projects and source code</li>
            <li>Guides, checklists, and career tips for developers</li>
          </ul>
          <p>We promise to only send high-quality development content. No spam, ever.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Srikant Sahu</strong><br/>Creator of SriKode</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-bottom: 0;">You are receiving this email because you subscribed to the SriKode newsletter.</p>
        </div>
      `
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
