import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api, { setAuthToken } from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activities: [],
    nutrition: [],
    goals: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { getToken } = useAuth();

  useEffect(() => {
    const setupToken = async () => {
      try {
        const token = await getToken();
        setAuthToken(token);
      } catch (error) {
        console.error('Error getting authentication token:', error);
        toast.error('Authentication error. Please sign in again.');
      }
    };
    
    setupToken();
  }, [getToken]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [activityRes, nutritionRes, goalsRes] = await Promise.all([
          api.get('/api/activity'),
          api.get('/api/nutrition'),
          api.get('/api/goals'),
        ]);
        
        setStats({
          activities: activityRes.data || [],
          nutrition: nutritionRes.data || [],
          goals: goalsRes.data || [],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please sign in again.');
          window.location.href = '/sign-in';
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"
        />
      </div>
    );
  }

  const chartData = (stats.activities || []).map((activity, index) => ({
    name: `Day ${index + 1}`,
    calories: activity.caloriesBurned || 0,
  }));

  const totalCaloriesBurned = stats.activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
  const totalCaloriesConsumed = stats.nutrition.reduce((sum, item) => sum + (item.calories || 0), 0);
  const completedGoals = stats.goals.filter(goal => goal.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Fitness Dashboard</h1>
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shadow-sm">
          {['overview', 'activities', 'nutrition', 'goals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-l-4 border-primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Calories Burned</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalCaloriesBurned} kcal</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, totalCaloriesBurned / 5000 * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-l-4 border-secondary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Calories Consumed</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalCaloriesConsumed} kcal</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, totalCaloriesConsumed / 2500 * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-l-4 border-accent"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Goals Completed</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {completedGoals} / {stats 건강. goals.length || 0}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.goals.length ? (completedGoals / stats.goals.length * 100) : 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Trends</h2>
            <button className="text-sm text-primary hover:underline focus:outline-none">View All</button>
          </div>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB', strokeOpacity: 0.2 }}
                  />
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB', strokeOpacity: 0.2 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                      fontSize: '12px',
                    }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`rgba(59, 130, 246, ${0.6 + index * 0.1})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No activity data available. Start logging activities to see trends.</p>
            </div>
          )}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
            <button className="text-sm text-primary hover:underline focus:outline-none">View All</button>
          </div>
          {stats.activities && stats.activities.length > 0 ? (
            <ul className="space-y-4">
              {stats.activities.slice(0, 5).map((activity, index) => (
                <motion.li
                  key={activity._id || index}
                  whileHover={{ x: 5, backgroundColor: '#F9FAFB' }}
                  className="flex items-start p-3 rounded-lg dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.caloriesBurned} kcal • {activity.duration || 'N/A'} mins
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p>No recent activities. Log your first activity to get started.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Nutrition and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Nutrition</h2>
            <button className="text-sm text-primary hover:underline focus:outline-none">View All</button>
          </div>
          {stats.nutrition && stats.nutrition.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Food</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Calories</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.nutrition.slice(0, 5).map((item, index) => (
                    <motion.tr
                      key={item._id || index}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      className="transition-colors dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.food}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.calories} kcal</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.time || 'N/A'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No nutrition data. Log your meals to track your intake.</p>
            </div>
          )}
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Goals</h2>
            <button className="text-sm text-primary hover:underline focus:outline-none">View All</button>
          </div>
          {stats.goals && stats.goals.length > 0 ? (
            <ul className="space-y-4">
              {stats.goals.slice(0, 5).map((goal, index) => (
                <motion.li
                  key={goal._id || index}
                  whileHover={{ x: 5, backgroundColor: '#F9FAFB' }}
                  className="p-4 rounded-lg dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                        goal.completed ? 'bg-secondary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      {goal.completed && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          goal.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {goal.type}: {goal.target}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {goal.deadline ? `Due: ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline'}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No goals set. Create your first goal to stay motivated.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;