import express from 'express';
import { createActivity, getUserActivities } from '../controllers/activityController.js';

const router = express.Router();

// POST new activity
router.post('/', createActivity);

// GET user activities
router.get('/', getUserActivities);

export default router;