import Activity from '../models/Activity.js';

// POST new activity
export const createActivity = async (req, res) => {
  try {
    const { type, duration, intensity, calories } = req.body;
    const auth = req.auth();
    const clerkUserId = auth?.userId;
    
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const activity = new Activity({ clerkUserId, type, duration, intensity, calories });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user activities
export const getUserActivities = async (req, res) => {
  try {
    const auth = req.auth();
    const clerkUserId = auth?.userId;
    
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const activities = await Activity.find({ clerkUserId });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};