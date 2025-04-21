import Goal from '../models/Goal.js';

// Create a new goal
export const createGoal = async (req, res) => {
  const { type, target } = req.body;
  const clerkUserId = req.auth?.userId;
  if (!clerkUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const goal = new Goal({ clerkUserId, type, target });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all goals for a user
export const getGoals = async (req, res) => {
  const clerkUserId = req.auth?.userId;
  if (!clerkUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const goals = await Goal.find({ clerkUserId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a goal
export const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { type, target } = req.body;
  const clerkUserId = req.auth?.userId;
  if (!clerkUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: id, clerkUserId },
      { type, target },
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  const { id } = req.params;
  const clerkUserId = req.auth?.userId;
  if (!clerkUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const goal = await Goal.findOneAndDelete({ _id: id, clerkUserId });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};