import mongoose from "mongoose";

const blogAnalyticsSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    date: {
      type: String, // Format: DD-MM-YYYY
      required: true,
    },
    country: {
      type: String, // Country Code e.g. "US", "IN"
      required: true,
      default: "Unknown",
    },
    city: {
      type: String,
      required: true,
      default: "Unknown",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index for fast upserting and aggregation queries
blogAnalyticsSchema.index({ blog: 1, date: 1, country: 1, city: 1 }, { unique: true });

export default mongoose.model("BlogAnalytics", blogAnalyticsSchema);
