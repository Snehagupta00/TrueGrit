import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  weight: { type: Number },
  height: { type: Number },
  fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', ''] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Profile', profileSchema);