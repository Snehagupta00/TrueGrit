import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { Activity, Flame, Clock, Calendar, Zap, ChevronRight } from 'lucide-react';

const INTENSITIES = [
  { value: 'low',    label: 'Low',    color: 'bg-blue-100 text-blue-700 border-blue-200',    active: 'bg-blue-500 text-white border-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200', active: 'bg-amber-500 text-white border-amber-500' },
  { value: 'high',   label: 'High',   color: 'bg-rose-100 text-rose-700 border-rose-200',   active: 'bg-rose-500 text-white border-rose-500' },
];

const QUICK_ACTIVITIES = ['Running', 'Cycling', 'Swimming', 'HIIT', 'Yoga', 'Weightlifting'];

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
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

const inputCls = (err) =>
  `w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all ${
    err ? 'border-red-300 bg-red-50' : 'border-gray-200'
  }`;

export default function ActivityLog() {
  const [activity, setActivity] = useState({
    type: '',
    duration: '',
    intensity: '',
    calories: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (k, v) => {
    setActivity(a => ({ ...a, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = useCallback(() => {
    const e = {};
    if (!activity.type.trim())                       e.type      = 'Activity type is required';
    if (!activity.duration || +activity.duration <= 0) e.duration = 'Enter a valid duration';
    if (!activity.intensity)                          e.intensity = 'Select intensity';
    if (!activity.calories || +activity.calories <= 0) e.calories = 'Enter valid calories';
    if (!activity.date)                               e.date      = 'Date is required';
    setErrors(e);
    return !Object.keys(e).length;
  }, [activity]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post('/api/activity', {
        type:      activity.type.trim(),
        duration:  +activity.duration,
        intensity: activity.intensity,
        calories:  +activity.calories,
        date:      activity.date,
      });
      toast.success('Workout logged!');
      setActivity({ type: '', duration: '', intensity: '', calories: '', date: new Date().toISOString().split('T')[0] });
      setErrors({});
    } catch {
      toast.error('Failed to log activity. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [activity, validate]);

  return (
    <div className="min-h-screen" style={{background:"var(--bg-page)"}}>
      <div className="page-container">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-2"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-md shadow-orange-200">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Log Workout</h1>
              <p className="text-sm text-gray-500">Track your activity and calories burned</p>
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

              {/* Activity Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Type</label>
                <input
                  type="text"
                  value={activity.type}
                  onChange={e => set('type', e.target.value)}
                  className={inputCls(errors.type)}
                  placeholder="e.g., Running, Swimming, HIIT"
                />
                {/* Quick select */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {QUICK_ACTIVITIES.map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => set('type', q)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        activity.type === q
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.type} />
              </div>

              {/* Duration + Calories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock size={13} className="inline mr-1 text-gray-400" />Duration (min)
                  </label>
                  <input
                    type="number"
                    value={activity.duration}
                    onChange={e => set('duration', e.target.value)}
                    className={inputCls(errors.duration)}
                    placeholder="30"
                    min="1"
                  />
                  <FieldError msg={errors.duration} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Flame size={13} className="inline mr-1 text-gray-400" />Calories Burned
                  </label>
                  <input
                    type="number"
                    value={activity.calories}
                    onChange={e => set('calories', e.target.value)}
                    className={inputCls(errors.calories)}
                    placeholder="250"
                    min="1"
                  />
                  <FieldError msg={errors.calories} />
                </div>
              </div>

              {/* Intensity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Zap size={13} className="inline mr-1 text-gray-400" />Intensity
                </label>
                <div className="flex gap-3">
                  {INTENSITIES.map(({ value, label, color, active }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set('intensity', value)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        activity.intensity === value ? active : `${color} hover:opacity-80`
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.intensity} />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={13} className="inline mr-1 text-gray-400" />Date
                </label>
                <input
                  type="date"
                  value={activity.date}
                  onChange={e => set('date', e.target.value)}
                  className={inputCls(errors.date)}
                />
                <FieldError msg={errors.date} />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-lg hover:shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Logging…</>
                ) : (
                  <><Activity size={16} />Log Workout<ChevronRight size={16} /></>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Tips Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Streak card */}
            <div className="card p-5 bg-gradient-to-br from-orange-50 to-rose-50 border-orange-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Zap size={18} className="text-orange-500" fill="#f97316" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">7-Day Streak!</p>
                  <p className="text-xs text-gray-500">Keep it going 🔥</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex-1 h-1.5 rounded-full bg-orange-400" />
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card p-5">
              <p className="text-sm font-bold text-gray-800 mb-3">💡 Logging Tips</p>
              <ul className="space-y-2.5">
                {[
                  'Log workouts right after to stay accurate',
                  'Higher intensity = more calories burned per minute',
                  'Aim for 150 min of moderate activity per week',
                  'Rest days count — log yoga or stretching!',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Calorie Guide */}
            <div className="card p-5">
              <p className="text-sm font-bold text-gray-800 mb-3">🔥 Calorie Estimates</p>
              <div className="space-y-2">
                {[
                  ['Running (30min)', '~300 kcal'],
                  ['Cycling (30min)', '~250 kcal'],
                  ['HIIT (20min)',    '~200 kcal'],
                  ['Yoga (45min)',    '~150 kcal'],
                ].map(([ex, cal]) => (
                  <div key={ex} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-600">{ex}</span>
                    <span className="text-xs font-bold text-orange-500">{cal}</span>
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
