import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api, { setAuthToken } from '../lib/api';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Utensils, Target, Activity, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#F97316', '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

function groupByDay(items, dateField, valueField) {
  const map = {};
  items.forEach(item => {
    const d = new Date(item[dateField] || item.createdAt);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    map[key] = (map[key] || 0) + (item[valueField] || 0);
  });
  return Object.entries(map)
    .slice(-14)
    .map(([date, value]) => ({ date, value }));
}

export default function Progress() {
  const [data, setData] = useState({ activities: [], nutrition: [], goals: [] });
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then(setAuthToken).catch(() => {});
  }, [getToken]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [aRes, nRes, gRes] = await Promise.all([
          api.get('/api/activity'),
          api.get('/api/nutrition'),
          api.get('/api/goals'),
        ]);
        setData({
          activities: aRes.data || [],
          nutrition: nRes.data || [],
          goals: gRes.data || [],
        });
      } catch {
        toast.error('Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-page)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading your progress…</p>
        </div>
      </div>
    );
  }

  const calorieBurnedByDay = groupByDay(data.activities, 'createdAt', 'calories');
  const calorieIntakeByDay = groupByDay(data.nutrition, 'createdAt', 'calories');
  const durationByDay      = groupByDay(data.activities, 'createdAt', 'duration');

  const activityTypeData = (() => {
    const map = {};
    data.activities.forEach(a => { map[a.type] = (map[a.type] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  const goalTypeData = (() => {
    const map = {};
    data.goals.forEach(g => { map[g.type || 'Other'] = (map[g.type || 'Other'] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  const totalCalBurned  = data.activities.reduce((s, a) => s + (a.calories  || 0), 0);
  const totalCalIntake  = data.nutrition.reduce((s,  n) => s + (n.calories  || 0), 0);
  const totalMinutes    = data.activities.reduce((s, a) => s + (a.duration  || 0), 0);
  const completedGoals  = data.goals.filter(g => g.completed).length;

  const summaryCards = [
    { label: 'Total Cal Burned',  value: totalCalBurned,  unit: 'kcal', icon: Flame,     bg: 'bg-orange-100', color: 'text-orange-500' },
    { label: 'Total Cal Intake',  value: totalCalIntake,  unit: 'kcal', icon: Utensils,  bg: 'bg-emerald-100', color: 'text-emerald-500' },
    { label: 'Total Active Time', value: totalMinutes,    unit: 'min',  icon: Activity,  bg: 'bg-blue-100',   color: 'text-blue-500' },
    { label: 'Goals Completed',   value: completedGoals,  unit: `/ ${data.goals.length}`, icon: Award, bg: 'bg-purple-100', color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="page-container">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pt-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-md shadow-orange-200">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
              <p className="text-sm text-gray-500">Your fitness journey over time</p>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="stat-card"
            >
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                <c.icon size={20} className={c.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{c.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.unit}</p>
              <p className="text-xs font-semibold text-gray-600 mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

          {/* Calories Burned trend */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Calories Burned — Last 14 Days</h2>
            {calorieBurnedByDay.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={calorieBurnedByDay}>
                  <defs>
                    <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#F97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" name="Calories" stroke="#F97316" fill="url(#burnGrad)" strokeWidth={2} dot={{ r: 3, fill: '#F97316' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No activity data yet</div>
            )}
          </motion.div>

          {/* Active Minutes trend */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Active Minutes — Last 14 Days</h2>
            {durationByDay.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={durationByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Minutes" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No activity data yet</div>
            )}
          </motion.div>

          {/* Calorie Intake trend */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Calorie Intake — Last 14 Days</h2>
            {calorieIntakeByDay.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={calorieIntakeByDay}>
                  <defs>
                    <linearGradient id="intakeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" name="Calories" stroke="#10B981" fill="url(#intakeGrad)" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No nutrition data yet</div>
            )}
          </motion.div>

          {/* Workout types breakdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Workout Types Breakdown</h2>
            {activityTypeData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={activityTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {activityTypeData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No activity data yet</div>
            )}
          </motion.div>
        </div>

        {/* Goal type breakdown — full width */}
        {goalTypeData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5 mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Goals by Type</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={goalTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Goals" radius={[0, 4, 4, 0]}>
                  {goalTypeData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

      </div>
    </div>
  );
}
