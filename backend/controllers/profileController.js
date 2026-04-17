import Profile from '../models/Profile.js';

// Get or create profile
export const getProfile = async (req, res) => {
  try {
    const auth = req.auth();
    const clerkUserId = auth?.userId;
    
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    let profile = await Profile.findOne({ clerkUserId });
    if (!profile) {
      profile = new Profile({ clerkUserId });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const auth = req.auth();
    const clerkUserId = auth?.userId;
    const { weight, height, fitnessLevel } = req.body;
    
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const profile = await Profile.findOneAndUpdate(
      { clerkUserId },
      { weight, height, fitnessLevel },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};