import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { Target, X, CheckCircle, Loader } from 'lucide-react';

function Goals() {
  const [goal, setGoal] = useState({ type: '', target: '' });
  const [goals, setGoals] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Use indigo as primary color to match with navbar
  const primaryColor = 'indigo';

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

  // Get goal type display and icon
  const getGoalTypeInfo = (type) => {
    switch(type) {
      case 'weight-loss':
        return { label: 'WEIGHT LOSS', icon: '⚖️' };
      case 'muscle-gain':
        return { label: 'MUSCLE GAIN', icon: '💪' };
      case 'steps':
        return { label: 'STEPS', icon: '👣' };
      default:
        return { label: type.toUpperCase(), icon: '🎯' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen md:pt-12"
    >
      <div className="flex items-center mb-6">
        <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Set Goals</h1>
      </div>

      {/* Goal Creation Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6 border border-gray-200 dark:border-gray-700"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Goal Type
            </label>
            <select
              value={goal.type}
              onChange={(e) => setGoal({ ...goal, type: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a goal type</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="steps">Steps</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <X size={16} className="inline mr-1" />
                {errors.type}
              </p>
            )}
          </div>
          
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Target
            </label>
            <input
              type="number"
              value={goal.target}
              onChange={(e) => setGoal({ ...goal, target: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-gray-100"
              placeholder="e.g., 5000"
            />
            {errors.target && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <X size={16} className="inline mr-1" />
                {errors.target}
              </p>
            )}
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center shadow-sm"
          >
            <CheckCircle size={18} className="mr-2" />
            Set Goal
          </motion.button>
        </form>
      </motion.div>

      {/* Goals List Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Your Goals
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader size={24} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
          </div>
        ) : goals.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {goals.map((g) => {
              const goalInfo = getGoalTypeInfo(g.type);
              return (
                <motion.li 
                  key={g._id} 
                  className="py-4 flex justify-between items-center"
                  whileHover={{ x: 5, backgroundColor: `rgba(99, 102, 241, 0.05)` }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center">
                    <span className={`text-xl mr-3 ${g.completed ? 'opacity-50' : ''}`}>
                      {goalInfo.icon}
                    </span>
                    <div>
                      <span className={`font-medium text-gray-900 dark:text-gray-100 ${g.completed ? 'line-through opacity-70' : ''}`}>
                        {goalInfo.label}
                      </span>
                      <div className={`text-sm text-gray-600 dark:text-gray-400 ${g.completed ? 'opacity-70' : ''}`}>
                        Target: <span className="font-semibold">{g.target}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(g._id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                    aria-label="Delete goal"
                  >
                    <X size={18} />
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <Target size={40} className="mb-2 opacity-40" />
            <p className="text-center">No goals set yet. Create your first goal above!</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Goals;