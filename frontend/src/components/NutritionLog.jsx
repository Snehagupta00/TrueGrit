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
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!nutrition.food.trim()) newErrors.food = 'Food item is required';
    if (!nutrition.calories || Number(nutrition.calories) <= 0) newErrors.calories = 'Calories must be a positive number';
    if (nutrition.carbs === '' || Number(nutrition.carbs) < 0) newErrors.carbs = 'Carbs must be a non-negative number';
    if (nutrition.protein === '' || Number(nutrition.protein) < 0) newErrors.protein = 'Protein must be a non-negative number';
    if (nutrition.fats === '' || Number(nutrition.fats) < 0) newErrors.fats = 'Fats must be a non-negative number';
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
      });
      toast.success('Nutrition logged successfully!');
      setNutrition({ food: '', calories: '', carbs: '', protein: '', fats: '' });
      setErrors({});
    } catch (error) {
      toast.error('Failed to log nutrition.');
      console.error('Error logging nutrition:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#4A5568', transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: '#CBD5E0', transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Log Nutrition
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Food Item
            </label>
            <motion.input
              type="text"
              value={nutrition.food}
              onChange={(e) => setNutrition({ ...nutrition, food: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., Chicken Breast"
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
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.food}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Calories (kcal)
            </label>
            <motion.input
              type="number"
              value={nutrition.calories}
              onChange={(e) => setNutrition({ ...nutrition, calories: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-colors"
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
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.calories}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Carbs (g)
            </label>
            <motion.input
              type="number"
              value={nutrition.carbs}
              onChange={(e) => setNutrition({ ...nutrition, carbs: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., 20"
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
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.carbs}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Protein (g)
            </label>
            <motion.input
              type="number"
              value={nutrition.protein}
              onChange={(e) => setNutrition({ ...nutrition, protein: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., 30"
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
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.protein}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Fats (g)
            </label>
            <motion.input
              type="number"
              value={nutrition.fats}
              onChange={(e) => setNutrition({ ...nutrition, fats: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-colors"
              placeholder="e.g., 10"
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
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.fats}
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
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? 'Logging...' : 'Log Nutrition'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default NutritionLog;