import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';

function ActivityLog() {
  const [activity, setActivity] = useState({
    type: '',
    duration: '',
    intensity: '',
    calories: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!activity.type.trim()) newErrors.type = 'Activity type is required';
    if (!activity.duration || Number(activity.duration) <= 0) newErrors.duration = 'Duration must be a positive number';
    if (!activity.intensity) newErrors.intensity = 'Intensity is required';
    if (!activity.calories || Number(activity.calories) <= 0) newErrors.calories = 'Calories must be a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post('/api/activity', {
        type: activity.type.trim(),
        duration: Number(activity.duration),
        intensity: activity.intensity,
        calories: Number(activity.calories),
      });
      toast.success('Activity logged successfully!');
      setActivity({ type: '', duration: '', intensity: '', calories: '' });
      setErrors({});
    } catch (error) {
      toast.error('Failed to log activity. Please try again.');
      console.error('Error logging activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#3B82F6', transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: '#D1D5DB', transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-primary dark:text-primary mb-6 text-center">
          Log Your Activity
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Activity Type
            </label>
            <motion.input
              type="text"
              value={activity.type}
              onChange={(e) => setActivity({ ...activity, type: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
              placeholder="e.g., Running"
              whileFocus="focus"
              initial="blur"
              variants={inputVariants}
              aria-invalid={errors.type ? 'true' : 'false'}
            />
            <AnimatePresence>
              {errors.type && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.type}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration (min)
            </label>
            <motion.input
              type="number"
              value={activity.duration}
              onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
              placeholder="e.g., 30"
              whileFocus="focus"
              initial="blur"
              variants={inputVariants}
              aria-invalid={errors.duration ? 'true' : 'false'}
            />
            <AnimatePresence>
              {errors.duration && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.duration}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Intensity
            </label>
            <motion.select
              value={activity.intensity}
              onChange={(e) => setActivity({ ...activity, intensity: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
              whileFocus="focus"
              initial="blur"
              variants={inputVariants}
              aria-invalid={errors.intensity ? 'true' : 'false'}
            >
              <option value="">Select Intensity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </motion.select>
            <AnimatePresence>
              {errors.intensity && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.intensity}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Calories Burned
            </label>
            <motion.input
              type="number"
              value={activity.calories}
              onChange={(e) => setActivity({ ...activity, calories: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
              placeholder="e.g., 200"
              whileFocus="focus"
              initial="blur"
              variants={inputVariants}
              aria-invalid={errors.calories ? 'true' : 'false'}
            />
            <AnimatePresence>
              {errors.calories && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.calories}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full p-3 rounded-lg font-semibold text-white transition-colors ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {isSubmitting ? 'Logging...' : 'Log Activity'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ActivityLog;