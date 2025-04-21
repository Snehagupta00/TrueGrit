import express from 'express';
import { createNutrition, getUserNutritionLogs } from '../controllers/nutritionController.js';

const router = express.Router();

// POST new nutrition log
router.post('/', createNutrition);

// GET user nutrition logs
router.get('/', getUserNutritionLogs);

export default router;