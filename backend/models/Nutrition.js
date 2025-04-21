import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  food: { type: String, required: true },
  calories: { type: Number, required: true },
  carbs: { type: Number, required: true },
  protein: { type: Number, required: true },
  fats: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Nutrition', nutritionSchema);