import resend from "../config/resend.js";
import { RESEND_FROM_EMAIL } from "../config/envConfig.js";

/**
 * Sends an email using Resend service.
 *
 * @param {Object} params - The email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML content of the email
 * @returns {Promise<Object>} Resend response details
 */
export const sendMail = async ({ to, subject, html }) => {
  try {
    const fromEmail = RESEND_FROM_EMAIL || "onboarding@resend.dev";
    
    const response = await resend.emails.send({
      from: `Srikode <${fromEmail}>`,
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Kept for backwards compatibility if needed elsewhere.
 * Sends a verification email.
 */
export const sendVerificationEmail = async ({ email, name, otp, html }) => {
  return sendMail({
    to: email,
    subject: "Verify Your Email",
    html,
  });
};
