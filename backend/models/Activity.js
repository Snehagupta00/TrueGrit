import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  intensity: { type: String, required: true },
  calories: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Activity', activitySchema);