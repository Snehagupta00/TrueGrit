import express from 'express';
import { getOrCreateUser } from '../controllers/userController.js';

const router = express.Router();

// Get or create user
router.get('/', getOrCreateUser);

export default router;