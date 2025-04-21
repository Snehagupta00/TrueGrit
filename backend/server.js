import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

// Validate environment variables
const requiredEnvVars = ['CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

const app = express();

app.use(clerkMiddleware());
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

import activityRoutes from './routes/activity.js';
import nutritionRoutes from './routes/nutrition.js';
import goalsRoutes from './routes/goals.js';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';

app.use('/api/activity', activityRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)).on(
  'error',
  (err) => {
    console.error('Server error:', err);
    process.exit(1);
  }
);