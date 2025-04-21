import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['weight-loss', 'muscle-gain', 'steps'],
  },
  target: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Goal', goalSchema);