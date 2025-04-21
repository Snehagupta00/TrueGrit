import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);