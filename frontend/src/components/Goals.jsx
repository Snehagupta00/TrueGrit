
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { Target, X, CheckCircle, Loader, Flame, Dumbbell, Footprints, Trophy } from 'lucide-react';

function Goals() {
  const [goal, setGoal] = useState({ 
    type: '', 
    target: '', 
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
  });
  const [goals, setGoals] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  const theme = {
    primary: '#4F46E5',
    accent: '#6366F1',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    background: '#F9FAFB',
    darkBackground: '#111827',
    darkSurface: '#1F2937',
  };

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
    if (!goal.deadline) newErrors.deadline = 'Deadline is required';
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
        deadline: goal.deadline,
      });
      setGoals([...goals, res.data]);
      toast.success('Goal set successfully!');
      setGoal({ 
        type: '', 
        target: '', 
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
      });
      setErrors({});
    } catch (error) {
      toast.error('Failed to set goal.');
      console.error('Error setting goal:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(/api/goals/${id});
      setGoals(goals.filter((g) => g._id !== id));
      toast.success('Goal deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete goal.');
      console.error('Error deleting goal:', error);
    }
  };

  const toggleGoalCompletion = async (id) => {
    try {
      const goalToUpdate = goals.find(g => g._id === id);
      const res = await api.patch(/api/goals/${id}, {
        completed: !goalToUpdate.completed
      });
      setGoals(goals.map(g => g._id === id ? res.data : g));
      toast.success(Goal marked as ${!goalToUpdate.completed ? 'completed' : 'incomplete'}!);
    } catch (error) {
      toast.error('Failed to update goal status.');
      console.error('Error updating goal:', error);
    }
  };

  const getGoalTypeInfo = (type) => {
    const types = {
      'weight-loss': { 
        label: 'Weight Loss', 
        icon: <Flame size={20} className="text-orange-500" />,
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
      },
      'muscle-gain': { 
        label: 'Muscle Gain', 
        icon: <Dumbbell size={20} className="text-blue-500" />,
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      },
      'steps': { 
        label: 'Steps', 
        icon: <Footprints size={20} className="text-green-500" />,
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      },
      default: { 
        label: type, 
        icon: <Target size={20} className="text-purple-500" />,
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
      }
    };
    return types[type] || types.default;
  };

  const filteredGoals = goals.filter(goal => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !goal.completed;
    if (activeTab === 'completed') return goal.completed;
    return true;
  });

  const progressPercentage = (goal) => {
    if (!goal.progress) return 0;
    return Math.min(100, Math.max(0, (goal.progress / goal.target) * 100));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen"
    >
      <div className="flex items-center mb-6">
        <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Your Fitness Goals</h1>
      </div>

      {/* Goal Creation Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-indigo-500 mr-2" />
          Set New Goal
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Goal Type
              </label>
              <select
                value={goal.type}
                onChange={(e) => setGoal({ ...goal, type: e.target.value })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors"
              >
                <option value="">Select goal type</option>
                <option value="weight-loss">Weight Loss (kg)</option>
                <option value="muscle-gain">Muscle Gain (kg)</option>
                <option value="steps">Daily Steps</option>
              </select>
              <AnimatePresence>
                {errors.type && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <X size={14} className="mr-1" />
                    {errors.type}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Value
              </label>
              <input
                type="number"
                value={goal.target}
                onChange={(e) => setGoal({ ...goal, target: e.target.value })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors"
                placeholder={goal.type === 'steps' ? "e.g., 10000" : "e.g., 5"}
              />
              <AnimatePresence>
                {errors.target && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <X size={14} className="mr-1" />
                    {errors.target}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Deadline
              </label>
              <input
                type="date"
                value={goal.deadline}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors"
              />
              <AnimatePresence>
                {errors.deadline && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <X size={14} className="mr-1" />
                    {errors.deadline}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-end">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center shadow-sm"
              >
                <CheckCircle size={18} className="mr-2" />
                Set Goal
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Goals List */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Trophy className="w-5 h-5 text-indigo-500 mr-2" />
            Your Goals
          </h2>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['all', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size={24} className="animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : filteredGoals.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredGoals.map((g) => {
              const goalInfo = getGoalTypeInfo(g.type);
              const progress = progressPercentage(g);
              const isOverdue = new Date(g.deadline) < new Date() && !g.completed;
              
              return (
                <motion.li 
                  key={g._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className={p-2 rounded-lg ${goalInfo.color} mr-3}>
                      {goalInfo.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${
                            g.completed ? 'line-through opacity-70' : ''
                          }`}>
                            {goalInfo.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Target: <span className="font-semibold">{g.target} {g.type === 'steps' ? 'steps' : 'kg'}</span>
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleGoalCompletion(g._id)}
                            className={`p-1 rounded-full ${
                              g.completed 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                            aria-label={g.completed ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            <CheckCircle size={18} />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(g._id)}
                            className="p-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            aria-label="Delete goal"
                          >
                            <X size={18} />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>
                            {g.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Progress'}
                          </span>
                          <span>
                            {g.progress ? Math.round(progress) : 0}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              g.completed 
                                ? 'bg-green-500'
                                : isOverdue
                                  ? 'bg-red-500'
                                  : 'bg-indigo-500'
                            }`}
                            style={{ width: ${g.completed ? 100 : progress}% }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            Deadline: {new Date(g.deadline).toLocaleDateString()}
                          </span>
                          <span>
                            {g.completed 
                              ? 'Completed'
                              : isOverdue
                                ? 'Past deadline'
                                : ${Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <Target size={48} className="mb-4 opacity-30" />
            <p className="text-center">
              {activeTab === 'all' 
                ? "You haven't set any goals yet."
                : activeTab === 'active'
                  ? "No active goals. Great job completing them all!"
                  : "No completed goals yet. Keep working!"}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Goals;
