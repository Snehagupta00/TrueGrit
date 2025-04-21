import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';

function Goals() {
  const [goal, setGoal] = useState({ type: '', target: '' });
  const [goals, setGoals] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get('/api/goals');
        setGoals(res.data);
      } catch (error) {
        toast.error('Failed to load goals.');
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!goal.type) newErrors.type = 'Goal type is required';
    if (!goal.target || goal.target <= 0) newErrors.target = 'Target must be a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await api.post('/api/goals', {
        type: goal.type,
        target: Number(goal.target),
      });
      setGoals([...goals, res.data]);
      toast.success('Goal set successfully!');
      setGoal({ type: '', target: '' });
      setErrors({});
    } catch (error) {
      toast.error('Failed to set goal.');
      console.error('Error setting goal:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/goals/${id}`);
      setGoals(goals.filter((g) => g._id !== id));
      toast.success('Goal deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete goal.');
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-primary dark:text-primary-light mb-6">Set Goals</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 mb-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Goal Type</label>
          <select
            value={goal.type}
            onChange={(e) => setGoal({ ...goal, type: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">Select</option>
            <option value="weight-loss">Weight Loss</option>
            <option value="muscle-gain">Muscle Gain</option>
            <option value="steps">Steps</option>
          </select>
          {errors.type && <p className="text-accent-red text-sm mt-1">{errors.type}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Target</label>
          <input
            type="number"
            value={goal.target}
            onChange={(e) => setGoal({ ...goal, target: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., 5000"
          />
          {errors.target && <p className="text-accent-red text-sm mt-1">{errors.target}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors"
        >
          Set Goal
        </button>
      </form>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Your Goals</h2>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : goals.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {goals.map((g) => (
              <li key={g._id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {g.type.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Target: {g.target}</span>
                </div>
                <button
                  onClick={() => handleDelete(g._id)}
                  className="text-accent-red hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No goals set yet.</p>
        )}
      </div>
    </motion.div>
  );
}

export default Goals;