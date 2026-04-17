import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { User, Scale, Ruler, Dumbbell, Salad, Zap, Save, ChevronRight, Info } from 'lucide-react';

const inputCls = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all';

function getBmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600',   bg: 'bg-blue-50',   bar: 'bg-blue-400' };
  if (bmi < 25)   return { label: 'Normal',      color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-400' };
  if (bmi < 30)   return { label: 'Overweight',  color: 'text-amber-600',  bg: 'bg-amber-50',  bar: 'bg-amber-400' };
  return             { label: 'Obese',        color: 'text-red-600',    bg: 'bg-red-50',    bar: 'bg-red-400' };
}

const LEVELS = [
  { value: 'beginner',     label: 'Beginner',     emoji: '🌱', desc: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate', emoji: '⚡', desc: 'Getting stronger' },
  { value: 'advanced',     label: 'Advanced',     emoji: '🔥', desc: 'Peak performance' },
];

export default function Profile() {
  const { user }      = useUser();
  const [profile, setProfile] = useState({ weight: '', height: '', fitnessLevel: '' });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recs,    setRecs]    = useState({ diet: null, workout: null, stats: null });

  useEffect(() => {
    if (!user) return;
    Promise.all([api.get('/api/profile'), api.get('/api/nutrition')])
      .then(([pRes, nRes]) => {
        if (pRes.data) setProfile(pRes.data);
        setHistory(nRes.data || []);
        generateRecs(pRes.data, nRes.data || []);
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [user]);

  const generateRecs = (p, nutrition) => {
    if (!p?.weight || !p?.height || !p?.fitnessLevel) return;
    const bmi = p.weight / ((p.height / 100) ** 2);
    let avg = { cal: 0, protein: 0, carbs: 0, fats: 0 };
    if (nutrition.length) {
      nutrition.forEach(n => { avg.cal += +n.calories || 0; avg.protein += +n.protein || 0; avg.carbs += +n.carbs || 0; avg.fats += +n.fats || 0; });
      avg = Object.fromEntries(Object.entries(avg).map(([k, v]) => [k, (v / nutrition.length).toFixed(1)]));
    }

    const diet = bmi < 18.5
      ? { goal: 'Weight Gain', calories: '+300–500 kcal daily', macros: 'High protein (1.6–2g/kg), healthy fats', suggestions: ['Chicken, fish, eggs, legumes', 'Nuts, avocados, olive oil', 'Whole grains, sweet potatoes'] }
      : bmi >= 25
      ? { goal: 'Weight Management', calories: '-300–500 kcal deficit', macros: 'High protein (1.6–2g/kg), moderate carbs', suggestions: ['Lean proteins: chicken, turkey, fish', 'Fiber-rich veggies & berries', 'Healthy fats in moderation'] }
      : { goal: 'Maintenance & Performance', calories: 'Maintain current intake', macros: 'Balanced macronutrients', suggestions: ['Varied protein sources', 'Complex carbs for energy', 'Balanced fat intake'] };

    const workoutMap = {
      beginner:     { freq: '3–4 days/week', intensity: 'Low–Moderate', focus: 'Building foundational strength', suggestions: ['Full-body compound movements', 'Bodyweight: squats, pushups, lunges', 'Cardio 20–30min (walking, cycling)'] },
      intermediate: { freq: '4–5 days/week', intensity: 'Moderate–High', focus: 'Build muscle & improve cardio', suggestions: ['Upper/lower or push/pull splits', 'Progressive overload with weights', 'Interval cardio sessions'] },
      advanced:     { freq: '5–6 days/week', intensity: 'High + deload weeks', focus: 'Performance optimization', suggestions: ['Periodized programs', 'Specialized training splits', 'Strategic cardio & recovery'] },
    };

    setRecs({ diet, workout: workoutMap[p.fitnessLevel] || workoutMap.beginner, stats: { bmi: bmi.toFixed(1), ...avg } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/profile', profile);
      generateRecs(profile, history);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:'var(--bg-page)'}}>
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  const bmiNum = profile.weight && profile.height ? +(profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : null;
  const bmiMeta = bmiNum ? getBmiCategory(bmiNum) : null;

  return (
    <div className="min-h-screen" style={{background:"var(--bg-page)"}}>
      <div className="page-container">

        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
        >
          <div className="relative shrink-0">
            <img
              src={user.imageUrl || 'https://via.placeholder.com/80'}
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-orange-100"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{user.emailAddresses[0]?.emailAddress}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">Premium Member</span>
              {profile.fitnessLevel && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full capitalize">{profile.fitnessLevel}</span>
              )}
              {bmiNum && (
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${bmiMeta.bg} ${bmiMeta.color}`}>
                  BMI {bmiNum} · {bmiMeta.label}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left column */}
          <div className="space-y-6">

            {/* Update Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <User size={18} className="text-orange-500" />
                <h2 className="text-base font-bold text-gray-900">Update Profile</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Scale size={13} className="inline mr-1 text-gray-400" />Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={profile.weight}
                      onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))}
                      className={inputCls}
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Ruler size={13} className="inline mr-1 text-gray-400" />Height (cm)
                    </label>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={e => setProfile(p => ({ ...p, height: e.target.value }))}
                      className={inputCls}
                      placeholder="175"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Dumbbell size={13} className="inline mr-1 text-gray-400" />Fitness Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {LEVELS.map(({ value, label, emoji, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setProfile(p => ({ ...p, fitnessLevel: value }))}
                        className={`py-3 rounded-xl border text-sm transition-all flex flex-col items-center gap-0.5 ${
                          profile.fitnessLevel === value
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <span className="text-lg">{emoji}</span>
                        <span className="font-semibold text-xs">{label}</span>
                        <span className={`text-[10px] ${profile.fitnessLevel === value ? 'text-orange-100' : 'text-gray-400'}`}>{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live BMI preview */}
                {bmiNum && (
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${bmiMeta.bg}`}>
                    <Info size={16} className={bmiMeta.color} />
                    <div>
                      <p className={`text-sm font-bold ${bmiMeta.color}`}>BMI: {bmiNum} — {bmiMeta.label}</p>
                      <div className="w-32 h-1.5 bg-white/60 rounded-full mt-1">
                        <div className={`h-full ${bmiMeta.bar} rounded-full`} style={{ width: `${Math.min(100, (bmiNum / 40) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-lg hover:shadow-orange-200 transition-all"
                >
                  <Save size={16} />Save Profile
                </motion.button>
              </form>
            </motion.div>

            {/* Nutrition History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Salad size={18} className="text-emerald-500" />
                  <h2 className="text-base font-bold text-gray-900">Nutrition History</h2>
                </div>
                <span className="text-xs text-gray-400">{history.length} entries</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                </div>
              ) : history.length > 0 ? (
                <div className="max-h-72 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  {history.map((item, i) => (
                    <motion.div
                      key={item._id || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.food}</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">C:{item.carbs || 0}g</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded font-medium">P:{item.protein || 0}g</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-pink-50 text-pink-600 rounded font-medium">F:{item.fats || 0}g</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 shrink-0">{item.calories} kcal</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                    <Salad size={24} className="text-emerald-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No nutrition data yet</p>
                  <p className="text-xs text-gray-400">Start logging meals to track macros</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right column — Stats + Recommendations */}
          <div className="space-y-6">
            {loading ? (
              <div className="card p-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : recs.diet && recs.workout ? (
              <>
                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-6"
                >
                  <h2 className="text-base font-bold text-gray-900 mb-4">Your Stats</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'BMI',            value: recs.stats.bmi,        unit: 'kg/m²', bg: 'bg-blue-50',    color: 'text-blue-600' },
                      { label: 'Avg Calories',   value: recs.stats.cal || '—', unit: 'kcal',  bg: 'bg-orange-50',  color: 'text-orange-600' },
                      { label: 'Avg Protein',    value: recs.stats.protein || '—', unit: 'g', bg: 'bg-purple-50',  color: 'text-purple-600' },
                      { label: 'Avg Carbs',      value: recs.stats.carbs || '—',   unit: 'g', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                    ].map(({ label, value, unit, bg, color }) => (
                      <div key={label} className={`${bg} rounded-xl p-4 hover:scale-[1.02] transition-transform`}>
                        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                        <div className="flex items-end gap-1">
                          <span className={`text-xl font-bold ${color}`}>{value}</span>
                          <span className="text-xs text-gray-400 mb-0.5">{unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Diet Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Salad size={18} className="text-emerald-500" />
                    <h2 className="text-base font-bold text-gray-900">Diet Plan</h2>
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">{recs.diet.goal}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-xs font-bold text-emerald-700 mb-0.5">Calories</p>
                      <p className="text-sm text-gray-700">{recs.diet.calories}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 mb-0.5">Macros Focus</p>
                      <p className="text-sm text-gray-700">{recs.diet.macros}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600 mb-2">Suggested Foods</p>
                      <ul className="space-y-1.5">
                        {recs.diet.suggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <ChevronRight size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Workout Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={18} className="text-orange-500" />
                    <h2 className="text-base font-bold text-gray-900">Workout Plan</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide mb-1">Frequency</p>
                      <p className="text-sm font-semibold text-gray-800">{recs.workout.freq}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide mb-1">Intensity</p>
                      <p className="text-sm font-semibold text-gray-800">{recs.workout.intensity}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl mb-3">
                    <p className="text-xs font-bold text-gray-600 mb-0.5">Focus</p>
                    <p className="text-sm text-gray-700">{recs.workout.focus}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 mb-2">Suggested Activities</p>
                    <ul className="space-y-1.5">
                      {recs.workout.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <ChevronRight size={14} className="text-orange-500 mt-0.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Info size={18} className="text-orange-500" />
                  <h2 className="text-base font-bold text-gray-900">Get Recommendations</h2>
                </div>
                <p className="text-sm text-gray-500 mb-5">
                  Complete your profile to receive personalised diet and workout plans.
                </p>
                <div className="space-y-3">
                  {['Enter your weight & height', 'Choose your fitness level', 'Click "Save Profile"', 'Log meals for detailed nutrition advice'].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
