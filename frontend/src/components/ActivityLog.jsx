import { useState } from 'react';
import { motion } from 'framer-motion';
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

  const validateForm = () => {
    const newErrors = {};
    if (!activity.type) newErrors.type = 'Activity type is required';
    if (!activity.duration || activity.duration <= 0) newErrors.duration = 'Duration must be a positive number';
    if (!activity.intensity) newErrors.intensity = 'Intensity is required';
    if (!activity.calories || activity.calories <= 0) newErrors.calories = 'Calories must be a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post('/api/activity', {
        type: activity.type,
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
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-primary dark:text-primary-light mb-6">Log Activity</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Activity Type</label>
          <input
            type="text"
            value={activity.type}
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., Running"
          />
          {errors.type && <p className="text-accent-red text-sm mt-1">{errors.type}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Duration (min)</label>
          <input
            type="number"
            value={activity.duration}
            onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., 30"
          />
          {errors.duration && <p className="text-accent-red text-sm mt-1">{errors.duration}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Intensity</label>
          <select
            value={activity.intensity}
            onChange={(e) => setActivity({ ...activity, intensity: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.intensity && <p className="text-accent-red text-sm mt-1">{errors.intensity}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Calories Burned</label>
          <input
            type="number"
            value={activity.calories}
            onChange={(e) => setActivity({ ...activity, calories: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., 200"
          />
          {errors.calories && <p className="text-accent-red text-sm mt-1">{errors.calories}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors"
        >
          Log Activity
        </button>
      </form>
    </motion.div>
  );
}

export default ActivityLog;