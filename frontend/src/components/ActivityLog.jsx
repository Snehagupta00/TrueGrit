import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';

function ActivityLog() {
  const [activity, setActivity] = useState({
    type: '',
    duration: '',
    intensity: '',
    calories: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = {
    primary: '#4F46E5',
    secondary: '#FFFFFF',
    background: '#F9FAFB',
    darkBackground: '#111827',
    darkSurface: '#1F2937',
    lightSurface: '#FFFFFF',
    accent: '#6366F1',
    accentLight: '#EEF2FF',
    accentDark: '#4338CA',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!activity.type.trim()) newErrors.type = 'Activity type is required';
    if (!activity.duration || Number(activity.duration) <= 0) newErrors.duration = 'Duration must be a positive number';
    if (!activity.intensity) newErrors.intensity = 'Intensity is required';
    if (!activity.calories || Number(activity.calories) <= 0) newErrors.calories = 'Calories must be a positive number';
    if (!activity.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [activity]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      await api.post('/api/activity', {
        type: activity.type.trim(),
        duration: Number(activity.duration),
        intensity: activity.intensity,
        calories: Number(activity.calories),
        date: activity.date,
      });
      toast.success('Activity logged successfully!');
      setActivity({ 
        type: '', 
        duration: '', 
        intensity: '', 
        calories: '',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    } catch (error) {
      toast.error('Failed to log activity. Please try again.');
      console.error('Error logging activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [activity, validateForm]);

  const inputVariants = {
    focus: { 
      scale: 1.02, 
      borderColor: theme.primary,
      boxShadow: `0 0 0 2px ${theme.accentLight}`,
      transition: { duration: 0.2 } 
    },
    blur: { 
      scale: 1, 
      borderColor: theme.border,
      boxShadow: 'none',
      transition: { duration: 0.2 } 
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
              <svg 
                className="w-6 h-6 text-green-600 dark:text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
              Log Activity
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Activity Type
              </label>
              <motion.input
                type="text"
                value={activity.type}
                onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                placeholder="e.g., Running, Swimming"
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
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.type}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration (min)
                </label>
                <motion.input
                  type="number"
                  value={activity.duration}
                  onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                  placeholder="30"
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
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.duration}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Calories
                </label>
                <motion.input
                  type="number"
                  value={activity.calories}
                  onChange={(e) => setActivity({ ...activity, calories: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                  placeholder="200"
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
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.calories}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Intensity
              </label>
              <motion.select
                value={activity.intensity}
                onChange={(e) => setActivity({ ...activity, intensity: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
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
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.intensity}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <motion.input
                type="date"
                value={activity.date}
                onChange={(e) => setActivity({ ...activity, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                whileFocus="focus"
                initial="blur"
                variants={inputVariants}
                aria-invalid={errors.date ? 'true' : 'false'}
              />
              <AnimatePresence>
                {errors.date && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.date}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging...
                </span>
              ) : 'Log Activity'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default ActivityLog;