import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';

function NutritionLog() {
  const [nutrition, setNutrition] = useState({
    food: '',
    calories: '',
    carbs: '',
    protein: '',
    fats: '',
    date: new Date().toISOString().split('T')[0],
    mealType: '',
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

  const validateForm = () => {
    const newErrors = {};
    if (!nutrition.food.trim()) newErrors.food = 'Food item is required';
    if (!nutrition.calories || Number(nutrition.calories) <= 0) newErrors.calories = 'Calories must be a positive number';
    if (nutrition.carbs === '' || Number(nutrition.carbs) < 0) newErrors.carbs = 'Carbs must be a non-negative number';
    if (nutrition.protein === '' || Number(nutrition.protein) < 0) newErrors.protein = 'Protein must be a non-negative number';
    if (nutrition.fats === '' || Number(nutrition.fats) < 0) newErrors.fats = 'Fats must be a non-negative number';
    if (!nutrition.date) newErrors.date = 'Date is required';
    if (!nutrition.mealType) newErrors.mealType = 'Meal type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post('/api/nutrition', {
        food: nutrition.food.trim(),
        calories: Number(nutrition.calories),
        carbs: Number(nutrition.carbs) || 0,
        protein: Number(nutrition.protein) || 0,
        fats: Number(nutrition.fats) || 0,
        date: nutrition.date,
        mealType: nutrition.mealType,
      });
      toast.success('Nutrition logged successfully!');
      setNutrition({ 
        food: '', 
        calories: '', 
        carbs: '', 
        protein: '', 
        fats: '',
        date: new Date().toISOString().split('T')[0],
        mealType: '',
      });
      setErrors({});
    } catch (error) {
      toast.error('Failed to log nutrition.');
      console.error('Error logging nutrition:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
              Log Nutrition
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Food Item
              </label>
              <motion.input
                type="text"
                value={nutrition.food}
                onChange={(e) => setNutrition({ ...nutrition, food: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                placeholder="e.g., Chicken Breast, Salad"
                whileFocus="focus"
                initial="blur"
                variants={inputVariants}
                aria-invalid={errors.food ? 'true' : 'false'}
              />
              <AnimatePresence>
                {errors.food && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.food}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Calories (kcal)
                </label>
                <motion.input
                  type="number"
                  value={nutrition.calories}
                  onChange={(e) => setNutrition({ ...nutrition, calories: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g., 500"
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

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meal Type
                </label>
                <motion.select
                  value={nutrition.mealType}
                  onChange={(e) => setNutrition({ ...nutrition, mealType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                  whileFocus="focus"
                  initial="blur"
                  variants={inputVariants}
                  aria-invalid={errors.mealType ? 'true' : 'false'}
                >
                  <option value="">Select Meal Type</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </motion.select>
                <AnimatePresence>
                  {errors.mealType && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.mealType}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Carbs (g)
                </label>
                <motion.input
                  type="number"
                  value={nutrition.carbs}
                  onChange={(e) => setNutrition({ ...nutrition, carbs: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                  placeholder="0"
                  whileFocus="focus"
                  initial="blur"
                  variants={inputVariants}
                  aria-invalid={errors.carbs ? 'true' : 'false'}
                />
                <AnimatePresence>
                  {errors.carbs && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.carbs}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Protein (g)
                </label>
                <motion.input
                  type="number"
                  value={nutrition.protein}
                  onChange={(e) => setNutrition({ ...nutrition, protein: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                  placeholder="0"
                  whileFocus="focus"
                  initial="blur"
                  variants={inputVariants}
                  aria-invalid={errors.protein ? 'true' : 'false'}
                />
                <AnimatePresence>
                  {errors.protein && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.protein}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fats (g)
                </label>
                <motion.input
                  type="number"
                  value={nutrition.fats}
                  onChange={(e) => setNutrition({ ...nutrition, fats: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-900 dark:text-white transition-colors"
                  placeholder="0"
                  whileFocus="focus"
                  initial="blur"
                  variants={inputVariants}
                  aria-invalid={errors.fats ? 'true' : 'false'}
                />
                <AnimatePresence>
                  {errors.fats && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.fats}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <motion.input
                type="date"
                value={nutrition.date}
                onChange={(e) => setNutrition({ ...nutrition, date: e.target.value })}
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
              ) : 'Log Nutrition'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default NutritionLog;