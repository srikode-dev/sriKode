import Subscriber from "../models/Subscriber.js";
import { sendNewsletterWelcomeEmail } from "../services/resendService.js";
import logger from "../config/logger.js";

/**
 * Public: Subscribe to newsletter
 */
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(200).json({
          success: true,
          message: "You are already subscribed to our newsletter!"
        });
      }

      // Re-activate inactive subscriber
      existingSubscriber.isActive = true;
      existingSubscriber.subscribedAt = new Date();
      await existingSubscriber.save();
      
      logger.info(`Re-activated newsletter subscriber: ${email}`);
      sendNewsletterWelcomeEmail(email);

      return res.status(200).json({
        success: true,
        message: "Subscription reactivated successfully! Welcome back."
      });
    }

    // Create new subscriber
    await Subscriber.create({
      email: email.toLowerCase(),
      isActive: true
    });

    logger.info(`New newsletter subscriber: ${email}`);
    
    // Dispatch welcome email asynchronously
    sendNewsletterWelcomeEmail(email);

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to the SriKode newsletter!"
    });
  } catch (error) {
    logger.error(`subscribe error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Public: Unsubscribe from newsletter
 */
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required"
      });
    }

    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber || !subscriber.isActive) {
      return res.status(200).json({
        success: true,
        message: "Email is not subscribed or already unsubscribed."
      });
    }

    subscriber.isActive = false;
    await subscriber.save();

    logger.info(`Unsubscribed subscriber: ${email}`);

    return res.status(200).json({
      success: true,
      message: "You have been unsubscribed from the newsletter successfully."
    });
  } catch (error) {
    logger.error(`unsubscribe error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Get all subscribers
 */
export const getAllSubscribersAdmin = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    logger.error(`getAllSubscribersAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * Admin: Delete a subscriber document
 */
export const deleteSubscriberAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findById(id);

    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    await Subscriber.findByIdAndDelete(id);
    logger.info(`Subscriber ID: ${id} deleted by admin`);

    return res.status(200).json({
      success: true,
      message: "Subscriber removed successfully"
    });
  } catch (error) {
    logger.error(`deleteSubscriberAdmin error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
