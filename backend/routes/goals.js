import express from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goalsController.js';

const router = express.Router();

// Create a new goal
router.post('/', createGoal);

// Get all goals for a user
router.get('/', getGoals);

// Update a goal
router.put('/:id', updateGoal);

// Delete a goal
router.delete('/:id', deleteGoal);

export default router;