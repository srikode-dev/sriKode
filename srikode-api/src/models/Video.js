import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  youtubeId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  publishedAt: {
    type: Date
  },
  viewCount: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isHidden: {
    type: Boolean,
    default: false,
    index: true
  },
  syncedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
