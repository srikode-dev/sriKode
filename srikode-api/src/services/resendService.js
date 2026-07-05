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
