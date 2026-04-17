import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { Utensils, Flame, Calendar, ChevronRight, Apple } from 'lucide-react';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch',     label: 'Lunch',     emoji: '☀️' },
  { value: 'dinner',    label: 'Dinner',    emoji: '🌙' },
  { value: 'snack',     label: 'Snack',     emoji: '🍎' },
];

const QUICK_FOODS = ['Chicken Breast', 'Brown Rice', 'Eggs', 'Oats', 'Salmon', 'Greek Yogurt'];

function FieldError({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
        >
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />{msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

const inputCls = (err) =>
  `w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all ${
    err ? 'border-red-300 bg-red-50' : 'border-gray-200'
  }`;

export default function NutritionLog() {
  const [nutrition, setNutrition] = useState({
    food: '', calories: '', carbs: '', protein: '', fats: '',
    date: new Date().toISOString().split('T')[0], mealType: '',
  });
  const [errors, setErrors]             = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (k, v) => {
    setNutrition(n => ({ ...n, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!nutrition.food.trim())                         e.food     = 'Food item is required';
    if (!nutrition.calories || +nutrition.calories <= 0) e.calories = 'Enter valid calories';
    if (nutrition.carbs   === '' || +nutrition.carbs   < 0) e.carbs   = 'Enter valid carbs';
    if (nutrition.protein === '' || +nutrition.protein < 0) e.protein = 'Enter valid protein';
    if (nutrition.fats    === '' || +nutrition.fats    < 0) e.fats    = 'Enter valid fats';
    if (!nutrition.date)                                 e.date     = 'Date is required';
    if (!nutrition.mealType)                             e.mealType = 'Select meal type';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post('/api/nutrition', {
        food:     nutrition.food.trim(),
        calories: +nutrition.calories,
        carbs:    +nutrition.carbs    || 0,
        protein:  +nutrition.protein  || 0,
        fats:     +nutrition.fats     || 0,
        date:     nutrition.date,
        mealType: nutrition.mealType,
      });
      toast.success('Meal logged!');
      setNutrition({ food: '', calories: '', carbs: '', protein: '', fats: '', date: new Date().toISOString().split('T')[0], mealType: '' });
      setErrors({});
    } catch {
      toast.error('Failed to log nutrition.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMacros = (+nutrition.carbs || 0) + (+nutrition.protein || 0) + (+nutrition.fats || 0);
  const carbPct    = totalMacros ? Math.round((+nutrition.carbs   || 0) / totalMacros * 100) : 0;
  const proteinPct = totalMacros ? Math.round((+nutrition.protein || 0) / totalMacros * 100) : 0;
  const fatPct     = totalMacros ? Math.round((+nutrition.fats    || 0) / totalMacros * 100) : 0;

  return (
    <div className="min-h-screen" style={{background:"var(--bg-page)"}}>
      <div className="page-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-2"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200">
              <Utensils size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Log Nutrition</h1>
              <p className="text-sm text-gray-500">Track your meals and macronutrients</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 card p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Meal Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MEAL_TYPES.map(({ value, label, emoji }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set('mealType', value)}
                      className={`py-3 rounded-xl text-sm font-semibold border transition-all flex flex-col items-center gap-1 ${
                        nutrition.mealType === value
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                    >
                      <span className="text-lg">{emoji}</span>
                      {label}
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.mealType} />
              </div>

              {/* Food Item */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Food Item</label>
                <input
                  type="text"
                  value={nutrition.food}
                  onChange={e => set('food', e.target.value)}
                  className={inputCls(errors.food)}
                  placeholder="e.g., Grilled Chicken, Brown Rice, Salad"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {QUICK_FOODS.map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => set('food', f)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        nutrition.food === f
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.food} />
              </div>

              {/* Calories + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Flame size={13} className="inline mr-1 text-gray-400" />Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={nutrition.calories}
                    onChange={e => set('calories', e.target.value)}
                    className={inputCls(errors.calories)}
                    placeholder="500"
                    min="1"
                  />
                  <FieldError msg={errors.calories} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={13} className="inline mr-1 text-gray-400" />Date
                  </label>
                  <input
                    type="date"
                    value={nutrition.date}
                    onChange={e => set('date', e.target.value)}
                    className={inputCls(errors.date)}
                  />
                  <FieldError msg={errors.date} />
                </div>
              </div>

              {/* Macros */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Macronutrients (g)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'carbs',   label: 'Carbs',   placeholder: '60', color: 'focus:ring-blue-400',   accent: 'text-blue-500'  },
                    { key: 'protein', label: 'Protein', placeholder: '30', color: 'focus:ring-purple-400', accent: 'text-purple-500' },
                    { key: 'fats',    label: 'Fats',    placeholder: '15', color: 'focus:ring-pink-400',   accent: 'text-pink-500'  },
                  ].map(({ key, label, placeholder, color, accent }) => (
                    <div key={key}>
                      <label className={`block text-xs font-bold mb-1.5 ${accent}`}>{label}</label>
                      <input
                        type="number"
                        value={nutrition[key]}
                        onChange={e => set(key, e.target.value)}
                        className={`w-full px-3 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors[key] ? 'border-red-300' : 'border-gray-200'} ${color}`}
                        placeholder={placeholder}
                        min="0"
                      />
                      <FieldError msg={errors[key]} />
                    </div>
                  ))}
                </div>

                {/* Macro preview bar */}
                {totalMacros > 0 && (
                  <div className="mt-3">
                    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                      {carbPct    > 0 && <div className="bg-blue-400 transition-all"   style={{ width: `${carbPct}%` }} />}
                      {proteinPct > 0 && <div className="bg-purple-400 transition-all" style={{ width: `${proteinPct}%` }} />}
                      {fatPct     > 0 && <div className="bg-pink-400 transition-all"   style={{ width: `${fatPct}%` }} />}
                    </div>
                    <div className="flex gap-4 mt-1.5">
                      {[['Carbs', carbPct, 'text-blue-500'], ['Protein', proteinPct, 'text-purple-500'], ['Fats', fatPct, 'text-pink-500']].map(([l, p, c]) => (
                        <span key={l} className={`text-[11px] font-semibold ${c}`}>{l} {p}%</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Logging…</>
                ) : (
                  <><Utensils size={16} />Log Meal<ChevronRight size={16} /></>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Daily Target */}
            <div className="card p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Apple size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Daily Target</p>
                  <p className="text-xs text-gray-500">2,000 kcal recommended</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {[['Protein', '150g', 75, 'bg-purple-400'], ['Carbs', '250g', 55, 'bg-blue-400'], ['Fats', '65g', 40, 'bg-pink-400']].map(([l, t, p, c]) => (
                  <div key={l}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-gray-600 font-medium">{l}</span>
                      <span className="text-gray-500">{t}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c} rounded-full`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Tips */}
            <div className="card p-5">
              <p className="text-sm font-bold text-gray-800 mb-3">🥗 Nutrition Tips</p>
              <ul className="space-y-2.5">
                {[
                  'Eat protein with every meal for muscle recovery',
                  'Complex carbs give steady energy all day',
                  'Healthy fats support hormone production',
                  'Drink 2-3L of water daily',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center shrink-0 text-[10px]">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Common calories */}
            <div className="card p-5">
              <p className="text-sm font-bold text-gray-800 mb-3">📊 Calorie Reference</p>
              <div className="space-y-2">
                {[
                  ['Chicken Breast (100g)', '165 kcal'],
                  ['Brown Rice (100g)',     '216 kcal'],
                  ['Avocado (half)',        '120 kcal'],
                  ['Egg (large)',           '78 kcal'],
                  ['Banana (medium)',       '89 kcal'],
                ].map(([f, c]) => (
                  <div key={f} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-600">{f}</span>
                    <span className="text-xs font-bold text-emerald-600">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
