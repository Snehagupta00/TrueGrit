import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, AreaChart, Area,
} from 'recharts';
import api, { setAuthToken } from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Target, Zap, Flame, BarChart2, CheckCircle2 } from 'lucide-react';

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

export default function Dashboard() {
  const [stats, setStats] = useState({ activities: [], nutrition: [], goals: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calories');
  const [timeRange, setTimeRange] = useState('7d');
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then(setAuthToken).catch(() => {});
  }, [getToken]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [actRes, nutRes, goalRes] = await Promise.all([
          api.get('/api/activity'),
          api.get('/api/nutrition'),
          api.get('/api/goals'),
        ]);
        setStats({
          activities: actRes.data || [],
          nutrition: nutRes.data || [],
          goals: goalRes.data || [],
        });
      } catch (err) {
        if (err.response?.status === 401) {
          return;
        } else {
          toast.error('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{background:'var(--bg-page)'}}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading your stats…</p>
        </div>
      </div>
    );
  }

  const chartData = stats.activities.map((a, i) => ({
    name: `Day ${i + 1}`,
    calories: a.caloriesBurned || 0,
    duration: a.duration || 0,
  }));

  const exerciseTypes = [...new Set(stats.activities.map(a => a.type))];
  const exerciseData = exerciseTypes.map(type => ({
    name: type,
    value: stats.activities
      .filter(a => a.type === type)
      .reduce((s, a) => s + (a.duration || 0), 0),
  }));

  const totalCalories = stats.activities.reduce((s, a) => s + (a.calories || 0), 0);
  const totalMinutes  = stats.activities.reduce((s, a) => s + (a.duration || 0), 0);
  const completedGoals = stats.goals.filter(g => g.completed).length;

  const weekSummary = (() => {
    const now = new Date();
    const startOfThisWeek = new Date(now); startOfThisWeek.setDate(now.getDate() - now.getDay());
    const startOfLastWeek = new Date(startOfThisWeek); startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    const thisWeek = stats.activities.filter(a => new Date(a.createdAt || a.date) >= startOfThisWeek);
    const lastWeek = stats.activities.filter(a => {
      const d = new Date(a.createdAt || a.date);
      return d >= startOfLastWeek && d < startOfThisWeek;
    });
    const thisNut  = stats.nutrition.filter(n => new Date(n.createdAt || n.date) >= startOfThisWeek);
    const lastNut  = stats.nutrition.filter(n => {
      const d = new Date(n.createdAt || n.date);
      return d >= startOfLastWeek && d < startOfThisWeek;
    });
    const tw = { cal: thisWeek.reduce((s,a)=>s+(a.calories||0),0), workouts: thisWeek.length, mins: thisWeek.reduce((s,a)=>s+(a.duration||0),0), nutCal: thisNut.reduce((s,n)=>s+(n.calories||0),0) };
    const lw = { cal: lastWeek.reduce((s,a)=>s+(a.calories||0),0), workouts: lastWeek.length, mins: lastWeek.reduce((s,a)=>s+(a.duration||0),0), nutCal: lastNut.reduce((s,n)=>s+(n.calories||0),0) };
    const diff = (a, b) => b === 0 ? null : Math.round(((a - b) / b) * 100);
    return { tw, lw, diff };
  })();

  const currentStreak = (() => {
    const days = new Set(
      stats.activities.map(a => new Date(a.createdAt || a.date).toDateString())
    );
    let streak = 0;
    const d = new Date();
    while (days.has(d.toDateString())) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  })();

  const statCards = [
    {
      title: 'Calories Burned',
      value: totalCalories,
      unit: 'kcal',
      change: '+12%',
      trend: 'up',
      icon: Flame,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
      bar: 'from-orange-400 to-rose-500',
      barPct: Math.min(100, (totalCalories / 5000) * 100),
      sub: 'vs last week',
    },
    {
      title: 'Active Minutes',
      value: totalMinutes,
      unit: 'min',
      change: '+8%',
      trend: 'up',
      icon: Activity,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      bar: 'from-blue-400 to-cyan-500',
      barPct: Math.min(100, (totalMinutes / 300) * 100),
      sub: 'vs last week',
    },
    {
      title: 'Goals Done',
      value: completedGoals,
      unit: `/ ${stats.goals.length}`,
      change: completedGoals > 0 ? '+25%' : '—',
      trend: completedGoals > 0 ? 'up' : 'neutral',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-500',
      bar: 'from-emerald-400 to-teal-500',
      barPct: stats.goals.length ? (completedGoals / stats.goals.length) * 100 : 0,
      sub: 'completion rate',
    },
    {
      title: 'Streak Days',
      value: currentStreak,
      unit: 'days',
      change: currentStreak > 0 ? `${currentStreak}🔥` : '—',
      trend: currentStreak > 0 ? 'up' : 'neutral',
      icon: Zap,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      bar: 'from-purple-400 to-pink-500',
      barPct: Math.min(100, (currentStreak / 30) * 100),
      sub: 'current streak',
    },
  ];

  return (
    <div className="min-h-screen" style={{background:"var(--bg-page)"}}>
      <div className="page-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pt-2"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your fitness journey and achievements</p>
          </div>

          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm self-start">
            {['1d', '7d', '30d', '1y'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  timeRange === r
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {r === '1d' ? '24H' : r === '7d' ? '7D' : r === '30d' ? '30D' : '1Y'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="stat-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <card.icon size={20} className={card.iconColor} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  card.trend === 'up'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {card.trend === 'up' && <TrendingUp size={10} />}
                  {card.trend === 'down' && <TrendingDown size={10} />}
                  {card.change}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                  <span className="text-sm text-gray-400">{card.unit}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{card.title}</p>
              </div>

              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.barPct}%` }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.4 }}
                  className={`h-full rounded-full bg-gradient-to-r ${card.bar}`}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">This Week vs Last Week</h2>
              <p className="text-xs text-gray-400">Week-over-week comparison</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Cal Burned',  tw: weekSummary.tw.cal,      lw: weekSummary.lw.cal,      unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Workouts',    tw: weekSummary.tw.workouts,  lw: weekSummary.lw.workouts,  unit: 'sessions', color: 'text-blue-500',   bg: 'bg-blue-50' },
              { label: 'Active Mins', tw: weekSummary.tw.mins,      lw: weekSummary.lw.mins,      unit: 'min',  color: 'text-purple-500', bg: 'bg-purple-50' },
              { label: 'Cal Intake',  tw: weekSummary.tw.nutCal,    lw: weekSummary.lw.nutCal,    unit: 'kcal', color: 'text-emerald-500',bg: 'bg-emerald-50' },
            ].map((item, i) => {
              const pct = weekSummary.diff(item.tw, item.lw);
              return (
                <div key={i} className={`rounded-xl p-3 ${item.bg}`}>
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{item.tw.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{item.unit}</p>
                  {pct !== null && (
                    <p className={`text-[10px] font-semibold mt-1 ${pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {pct >= 0 ? '▲' : '▼'} {Math.abs(pct)}% vs last week
                    </p>
                  )}
                  {pct === null && <p className="text-[10px] text-gray-400 mt-1">No data last week</p>}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2 card p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Activity Overview</h2>
                <p className="text-sm text-gray-500">Workout performance this week</p>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 self-start">
                {['calories', 'duration', 'trend'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                      activeTab === t
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72">
              <AnimatePresence mode="wait">
                {chartData.length > 0 ? (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {activeTab === 'trend' ? (
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                          <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="calories" stroke="#F97316" strokeWidth={2} fill="url(#areaGrad)" />
                        </AreaChart>
                      ) : (
                        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                          <defs>
                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#F97316" />
                              <stop offset="100%" stopColor="#EF4444" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                          <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey={activeTab === 'calories' ? 'calories' : 'duration'}
                            fill="url(#barGrad)"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-3">
                      <BarChart2 size={24} className="text-orange-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No activity data yet</p>
                    <p className="text-sm text-gray-400">Start logging workouts to see your progress</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Exercise Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-1">Exercise Types</h2>
            <p className="text-sm text-gray-500 mb-4">Workout distribution</p>

            <div className="h-52">
              {exerciseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exerciseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {exerciseData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                    <Target size={24} className="text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-400 text-center">No exercise data yet</p>
                </div>
              )}
            </div>

            {exerciseData.length > 0 && (
              <div className="mt-2 space-y-2">
                {exerciseData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{item.value}min</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Workouts + Goals */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Recent Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Workouts</h2>
                <p className="text-sm text-gray-500">Your latest activities</p>
              </div>
              <Link to="/activity" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                View All →
              </Link>
            </div>

            {stats.activities.length > 0 ? (
              <div className="space-y-3">
                {stats.activities.slice(0, 5).map((a, i) => (
                  <motion.div
                    key={a._id || i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shrink-0">
                      <Activity size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{a.type}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(a.date || Date.now()).toLocaleDateString()}
                      </p>
                      <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((a.duration || 0) / 60) * 100)}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                          className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-orange-500">{a.duration || 0}m</p>
                      <p className="text-xs text-gray-400">{a.caloriesBurned || 0} cal</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-3">
                  <Activity size={24} className="text-orange-400" />
                </div>
                <p className="text-gray-500 font-medium">No workouts yet</p>
                <p className="text-sm text-gray-400">Start your fitness journey today</p>
              </div>
            )}
          </motion.div>

          {/* Active Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Active Goals</h2>
                <p className="text-sm text-gray-500">Your current targets</p>
              </div>
              <Link to="/goals" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                View All →
              </Link>
            </div>

            {stats.goals.length > 0 ? (
              <div className="space-y-3">
                {stats.goals.slice(0, 4).map((goal, i) => (
                  <motion.div
                    key={goal._id || i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-4 rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                        goal.completed ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}>
                        {goal.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${goal.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {goal.type}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Target: {goal.target}</p>
                        {!goal.completed && (
                          <div className="mt-2">
                            <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                              <span>Progress</span>
                              <span className="text-orange-500 font-semibold">65%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 0.8, delay: i * 0.1 + 0.4 }}
                                className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full"
                              />
                            </div>
                          </div>
                        )}
                        {goal.deadline && (
                          <p className="text-[11px] text-gray-400 mt-1.5">
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        goal.completed
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-orange-50 text-orange-500'
                      }`}>
                        {goal.completed ? 'Done' : 'Active'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                  <Target size={24} className="text-emerald-400" />
                </div>
                <p className="text-gray-500 font-medium">No active goals</p>
                <p className="text-sm text-gray-400">Set your first fitness goal</p>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
