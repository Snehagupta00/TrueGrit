import { useState } from 'react';
import { motion } from 'framer-motion';
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

  const validateForm = () => {
    const newErrors = {};
    if (!nutrition.food) newErrors.food = 'Food item is required';
    if (!nutrition.calories || nutrition.calories <= 0) newErrors.calories = 'Calories must be a positive number';
    if (!nutrition.carbs || nutrition.carbs < 0) newErrors.carbs = 'Carbs must be a non-negative number';
    if (!nutrition.protein || nutrition.protein < 0) newErrors.protein = 'Protein must be a non-negative number';
    if (!nutrition.fats || nutrition.fats < 0) newErrors.fats = 'Fats must be a non-negative number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post('/api/nutrition', {
        food: nutrition.food,
        calories: Number(nutrition.calories),
        carbs: Number(nutrition.carbs),
        protein: Number(nutrition.protein),
        fats: Number(nutrition.fats),
      });
      toast.success('Nutrition logged successfully!');
      setNutrition({ food: '', calories: '', carbs: '', protein: '', fats: '' });
      setErrors({});
    } catch (error) {
      toast.error('Failed to log nutrition.');
      console.error('Error logging nutrition:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-primary dark:text-primary-light mb-6">Log Nutrition</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Food Item</label>
          <input
            type="text"
            value={nutrition.food}
            onChange={(e) => setNutrition({ ...nutrition, food: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., Chicken Breast"
          />
          {errors.food && <p className="text-accent-red text-sm mt-1">{errors.food}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Calories (kcal)</label>
          <input
            type="number"
            value={nutrition.calories}
            onChange={(e) => setNutrition({ ...nutrition, calories: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., 500"
          />
          {errors.calories && <p className="text-accent-red text-sm mt-1">{errors.calories}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Carbs (g)</label>
          <input
            type="number"
            value={nutrition.carbs}
            onChange={(e) => setNutrition({ ...nutrition, carbs: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., 20"
          />
          {errors.carbs && <p className="text-accent-red text-sm mt-1">{errors.carbs}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Protein (g)</label>
          <input
            type="number"
            value={nutrition.protein}
            onChange={(e) => setNutrition({ ...nutrition, protein: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., 30"
          />
          {errors.protein && <p className="text-accent-red text-sm mt-1">{errors.protein}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Fats (g)</label>
          <input
            type="number"
            value={nutrition.fats}
            onChange={(e) => setNutrition({ ...nutrition, fats: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="e.g., 10"
          />
          {errors.fats && <p className="text-accent-red text-sm mt-1">{errors.fats}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors"
        >
          Log Nutrition
        </button>
      </form>
    </motion.div>
  );
}

export default NutritionLog;