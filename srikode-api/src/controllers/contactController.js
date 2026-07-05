import Contact from "../models/Contact.js";
import { sendContactEmail } from "../services/resendService.js";
import logger from "../config/logger.js";

/**
 * Public: Submit contact form details, store in DB, and email admin.
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, subject, message) are required"
      });
    }

    // Save submission to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      isRead: false
    });

    logger.info(`New contact submission from: ${name} (${email}) - Subject: ${subject}`);

    // Asynchronously send email notification to admin via Resend
    // (We do not await this block synchronously to ensure immediate user response)
    sendContactEmail(name, email, subject, message);

    return res.status(201).json({
      success: true,
      message: "Message submitted successfully! Thank you.",
      contactId: contact._id
    });
  } catch (error) {
    logger.error(`submitContact controller error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Get all contact query messages
 */
export const getAllContactsAdmin = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    logger.error(`getAllContactsAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Mark a contact query as read/unread
 */
export const markContactAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    if (isRead === undefined) {
      return res.status(400).json({
        success: false,
        message: "isRead parameter is required"
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    contact.isRead = isRead;
    await contact.save();

    return res.status(200).json({
      success: true,
      message: `Message marked as ${isRead ? "read" : "unread"}`
    });
  } catch (error) {
    logger.error(`markContactAsRead error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Delete a contact query message
 */
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    await Contact.findByIdAndDelete(id);

    logger.info(`Contact message with ID: ${id} deleted by admin`);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    logger.error(`deleteContact error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
