import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
