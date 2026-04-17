import { useState, useEffect, useMemo } from 'react';
import api, { setAuthToken } from '../lib/api';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { History as HistoryIcon, Activity, Utensils, Search, Trash2, Filter, Calendar } from 'lucide-react';

const INTENSITY_COLOR = {
  low:    'bg-emerald-100 text-emerald-700',
  medium: 'bg-orange-100 text-orange-700',
  high:   'bg-red-100    text-red-700',
};

export default function History() {
  const [activities, setActivities] = useState([]);
  const [nutrition,  setNutrition]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState('all');
  const [search,     setSearch]     = useState('');
  const [deleting,   setDeleting]   = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then(setAuthToken).catch(() => {});
  }, [getToken]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [aRes, nRes] = await Promise.all([
          api.get('/api/activity'),
          api.get('/api/nutrition'),
        ]);
        setActivities(aRes.data || []);
        setNutrition(nRes.data  || []);
      } catch {
        toast.error('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDeleteActivity = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/api/activity/${id}`);
      setActivities(prev => prev.filter(a => a._id !== id));
      toast.success('Activity deleted.');
    } catch {
      toast.error('Failed to delete.');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteNutrition = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/api/nutrition/${id}`);
      setNutrition(prev => prev.filter(n => n._id !== id));
      toast.success('Meal deleted.');
    } catch {
      toast.error('Failed to delete.');
    } finally {
      setDeleting(null);
    }
  };

  const combined = useMemo(() => {
    const acts = activities.map(a => ({ ...a, _kind: 'activity' }));
    const nuts  = nutrition.map(n  => ({ ...n, _kind: 'nutrition' }));
    const all   = [...acts, ...nuts].sort((a, b) =>
      new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );
    const q = search.toLowerCase();
    return all.filter(item => {
      if (tab === 'workout'   && item._kind !== 'activity')  return false;
      if (tab === 'nutrition' && item._kind !== 'nutrition') return false;
      if (!q) return true;
      return (item.type || item.food || '').toLowerCase().includes(q);
    });
  }, [activities, nutrition, tab, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-page)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading history…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="page-container">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 pt-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200">
              <HistoryIcon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">History</h1>
              <p className="text-sm text-gray-500">{combined.length} entries · all your logged data</p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search workouts, foods…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
          </div>

          {/* Tab filter */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 self-start">
            {[
              { key: 'all',       label: 'All' },
              { key: 'workout',   label: 'Workouts' },
              { key: 'nutrition', label: 'Nutrition' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === key
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Workouts',    value: activities.length,  color: 'text-orange-500',  bg: 'bg-orange-50'  },
            { label: 'Total Meals',       value: nutrition.length,   color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Calories Burned',   value: activities.reduce((s, a) => s + (a.calories || 0), 0).toLocaleString(), color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-3 ${s.bg} text-center`}>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2">
          <AnimatePresence>
            {combined.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-12 text-center"
              >
                <HistoryIcon size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No entries found</p>
                <p className="text-sm text-gray-400">Try a different filter or log your first activity</p>
              </motion.div>
            ) : (
              combined.map((item, i) => {
                const isActivity = item._kind === 'activity';
                const date = new Date(item.createdAt || item.date);
                return (
                  <motion.div
                    key={item._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="card px-4 py-3 flex items-center gap-4"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActivity ? 'bg-gradient-to-br from-orange-400 to-rose-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                    }`}>
                      {isActivity
                        ? <Activity size={16} className="text-white" />
                        : <Utensils size={16} className="text-white" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {isActivity ? item.type : item.food}
                        </p>
                        {isActivity && item.intensity && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${INTENSITY_COLOR[item.intensity] || 'bg-gray-100 text-gray-600'}`}>
                            {item.intensity}
                          </span>
                        )}
                        {!isActivity && item.mealType && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                            {item.mealType}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        {isActivity && <p className="text-xs text-gray-400">{item.duration || 0} min</p>}
                        {!isActivity && item.protein != null && (
                          <p className="text-xs text-gray-400">P:{item.protein}g C:{item.carbs}g F:{item.fat}g</p>
                        )}
                      </div>
                    </div>

                    {/* Right — calories + delete */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isActivity ? 'text-orange-500' : 'text-emerald-500'}`}>
                          {item.calories || 0}
                        </p>
                        <p className="text-[10px] text-gray-400">kcal</p>
                      </div>
                      <button
                        onClick={() => isActivity ? handleDeleteActivity(item._id) : handleDeleteNutrition(item._id)}
                        disabled={deleting === item._id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        {deleting === item._id
                          ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
