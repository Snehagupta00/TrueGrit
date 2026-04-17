import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { Target, X, CheckCircle2, Loader2, Flame, Dumbbell, Footprints, Trophy, Plus, CalendarDays } from 'lucide-react';

function getGoalMeta(type) {
  const map = {
    'weight-loss': { label: 'Weight Loss', icon: Flame,      bg: 'bg-orange-100', color: 'text-orange-500', badge: 'bg-orange-50 text-orange-600 border-orange-100', bar: 'bg-orange-400' },
    'muscle-gain': { label: 'Muscle Gain', icon: Dumbbell,   bg: 'bg-blue-100',   color: 'text-blue-500',   badge: 'bg-blue-50 text-blue-600 border-blue-100',       bar: 'bg-blue-400'   },
    'steps':       { label: 'Daily Steps', icon: Footprints,  bg: 'bg-green-100',  color: 'text-green-500',  badge: 'bg-green-50 text-green-600 border-green-100',     bar: 'bg-green-400'  },
  };
  return map[type] || { label: type, icon: Target, bg: 'bg-purple-100', color: 'text-purple-500', badge: 'bg-purple-50 text-purple-600 border-purple-100', bar: 'bg-purple-400' };
}

const selectCls = 'w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all';
const inputCls  = selectCls;

function FieldError({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-red-500 text-xs mt-1.5"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function Goals() {
  const [goal,      setGoal]      = useState({ type: '', target: '', deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] });
  const [goals,     setGoals]     = useState([]);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    api.get('/api/goals')
      .then(r => setGoals(r.data))
      .catch(() => toast.error('Failed to load goals.'))
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const e = {};
    if (!goal.type)                    e.type    = 'Select a goal type';
    if (!goal.target || +goal.target <= 0) e.target = 'Enter a valid target';
    if (!goal.deadline)                e.deadline = 'Set a deadline';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await api.post('/api/goals', { type: goal.type, target: +goal.target, deadline: goal.deadline });
      setGoals(prev => [...prev, res.data]);
      toast.success('Goal created!');
      setGoal({ type: '', target: '', deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] });
      setErrors({});
    } catch {
      toast.error('Failed to create goal.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/goals/${id}`);
      setGoals(prev => prev.filter(g => g._id !== id));
      toast.success('Goal removed.');
    } catch {
      toast.error('Failed to delete goal.');
    }
  };

  const toggleComplete = async (id) => {
    const g = goals.find(x => x._id === id);
    try {
      const res = await api.patch(`/api/goals/${id}`, { completed: !g.completed });
      setGoals(prev => prev.map(x => x._id === id ? res.data : x));
      toast.success(res.data.completed ? 'Goal completed! 🎉' : 'Marked as active.');
    } catch {
      toast.error('Failed to update goal.');
    }
  };

  const filtered = goals.filter(g => {
    if (activeTab === 'active')    return !g.completed;
    if (activeTab === 'completed') return  g.completed;
    return true;
  });

  const completedCount = goals.filter(g => g.completed).length;
  const activeCount    = goals.filter(g => !g.completed).length;

  return (
    <div className="min-h-screen" style={{background:"var(--bg-page)"}}>
      <div className="page-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-md shadow-red-200">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fitness Goals</h1>
              <p className="text-sm text-gray-500">Set targets and track your progress</p>
            </div>
          </div>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Goals',  value: goals.length, icon: Target,       bg: 'bg-blue-50',    color: 'text-blue-600' },
            { label: 'Active',       value: activeCount,  icon: Flame,        bg: 'bg-orange-50',  color: 'text-orange-600' },
            { label: 'Completed',    value: completedCount, icon: Trophy,      bg: 'bg-emerald-50', color: 'text-emerald-600' },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Create Goal Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Plus size={18} className="text-orange-500" />
              <h2 className="text-base font-bold text-gray-900">New Goal</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Type</label>
                <select
                  value={goal.type}
                  onChange={e => { setGoal(g => ({ ...g, type: e.target.value })); setErrors(er => ({ ...er, type: '' })); }}
                  className={selectCls}
                >
                  <option value="">Select goal type…</option>
                  <option value="weight-loss">🔥 Weight Loss (kg)</option>
                  <option value="muscle-gain">💪 Muscle Gain (kg)</option>
                  <option value="steps">👟 Daily Steps</option>
                </select>
                <FieldError msg={errors.type} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Value</label>
                <input
                  type="number"
                  value={goal.target}
                  onChange={e => { setGoal(g => ({ ...g, target: e.target.value })); setErrors(er => ({ ...er, target: '' })); }}
                  className={inputCls}
                  placeholder={goal.type === 'steps' ? '10000' : '5'}
                  min="1"
                />
                <FieldError msg={errors.target} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <CalendarDays size={13} className="inline mr-1 text-gray-400" />Deadline
                </label>
                <input
                  type="date"
                  value={goal.deadline}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => { setGoal(g => ({ ...g, deadline: e.target.value })); setErrors(er => ({ ...er, deadline: '' })); }}
                  className={inputCls}
                />
                <FieldError msg={errors.deadline} />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-lg hover:shadow-orange-200 transition-all"
              >
                <Plus size={16} />Set Goal
              </motion.button>
            </form>
          </motion.div>

          {/* Goals List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 card overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-orange-500" />
                <h2 className="text-base font-bold text-gray-900">Your Goals</h2>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {['all', 'active', 'completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={24} className="animate-spin text-orange-500" />
              </div>
            ) : filtered.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filtered.map((g, i) => {
                    const meta      = getGoalMeta(g.type);
                    const Icon      = meta.icon;
                    const progress  = g.progress ? Math.min(100, (g.progress / g.target) * 100) : 0;
                    const isOverdue = new Date(g.deadline) < new Date() && !g.completed;
                    const daysLeft  = Math.ceil((new Date(g.deadline) - new Date()) / 86400000);

                    return (
                      <motion.li
                        key={g._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                            <Icon size={18} className={meta.color} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className={`font-semibold text-sm ${g.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {meta.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Target: <span className="font-bold text-gray-700">{g.target} {g.type === 'steps' ? 'steps' : 'kg'}</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  g.completed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                  isOverdue   ? 'bg-red-50 text-red-600 border-red-100' :
                                               meta.badge
                                }`}>
                                  {g.completed ? 'Done' : isOverdue ? 'Overdue' : `${daysLeft}d left`}
                                </span>
                                <button
                                  onClick={() => toggleComplete(g._id)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                    g.completed ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-500'
                                  }`}
                                >
                                  <CheckCircle2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(g._id)}
                                  className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div>
                              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                                <span>{g.completed ? 'Completed' : isOverdue ? 'Past deadline' : 'Progress'}</span>
                                <span className="font-semibold">{g.completed ? 100 : Math.round(progress)}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${g.completed ? 100 : progress}%` }}
                                  transition={{ duration: 0.8 }}
                                  className={`h-full rounded-full ${g.completed ? 'bg-emerald-400' : isOverdue ? 'bg-red-400' : meta.bar}`}
                                />
                              </div>
                              <p className="text-[11px] text-gray-400 mt-1">
                                Deadline: {new Date(g.deadline).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                  <Target size={28} className="text-orange-400" />
                </div>
                <p className="font-semibold text-gray-600">
                  {activeTab === 'all'
                    ? "No goals yet — create your first one!"
                    : activeTab === 'active'
                      ? "No active goals. Nice work!"
                      : "No completed goals yet. Keep pushing!"}
                </p>
                <p className="text-sm text-gray-400 mt-1">Use the form on the left to set a goal.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
