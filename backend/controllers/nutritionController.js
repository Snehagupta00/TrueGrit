import Nutrition from '../models/Nutrition.js';

// POST new nutrition log
export const createNutrition = async (req, res) => {
  try {
    const { food, calories, carbs, protein, fats } = req.body;
    const auth = req.auth();
    const clerkUserId = auth?.userId;
    
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const nutrition = new Nutrition({ clerkUserId, food, calories, carbs, protein, fats });
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user nutrition logs
export const getUserNutritionLogs = async (req, res) => {
  try {
    const auth = req.auth();
    const clerkUserId = auth?.userId;
    
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const nutritionLogs = await Nutrition.find({ clerkUserId });
    res.json(nutritionLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};