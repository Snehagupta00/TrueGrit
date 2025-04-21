import User from '../models/User.js';

// Get or create user
export const getOrCreateUser = async (req, res) => {
  const clerkUserId = req.auth?.userId;
  const clerkUser = req.auth?.user;
  if (!clerkUserId || !clerkUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = new User({
        clerkUserId,
        name: clerkUser.fullName || clerkUser.firstName || '',
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
      });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};