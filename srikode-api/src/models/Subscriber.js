import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
export default Subscriber;
