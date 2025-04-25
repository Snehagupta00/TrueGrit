
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import api, { setAuthToken } from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activities: [],
    nutrition: [],
    goals: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { getToken } = useAuth();

  const theme = {
    primary: '#4F46E5',
    secondary: '#FFFFFF',
    background: '#F9FAFB',
    darkBackground: '#111827',
    darkSurface: '#1F2937',
    lightSurface: '#FFFFFF',
    accent: '#6366F1',
    accentLight: '#EEF2FF',
    accentDark: '#4338CA',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
  };

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
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div 
          className="rounded-full h-12 w-12 border-t-4 border-b-4 animate-spin"
          style={{ borderColor: theme.primary }}
        ></div>
      </div>
    );
  }

  // Process data for charts
  const chartData = (stats.activities || []).map((activity, index) => ({
    name: Day ${index + 1},
    calories: activity.caloriesBurned || 0,
    duration: activity.duration || 0,
  }));

  const exerciseTypes = [...new Set(stats.activities.map(a => a.type))];
  const exerciseData = exerciseTypes.map(type => ({
    name: type,
    value: stats.activities.filter(a => a.type === type).reduce((sum, a) => sum + (a.duration || 0), 0),
  }));

  const totalCaloriesBurned = stats.activities.reduce((sum, activity) => sum + (activity.calories || 0), 0);
  const totalCaloriesConsumed = stats.nutrition.reduce((sum, item) => sum + (item.calories || 0), 0);
  const completedGoals = stats.goals.filter(goal => goal.completed).length;
  const totalExerciseMinutes = stats.activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
  
  // Define stat cards data
  const statCards = [
    {
      title: 'Calories Burned',
      value: totalCaloriesBurned,
      unit: 'kcal',
      max: 5000,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Exercise Time',
      value: totalExerciseMinutes,
      unit: 'mins',
      max: 300,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Goals Completed',
      value: completedGoals,
<<<<<<< HEAD
      unit: `/${stats.goals.length || 0}`,
=======
      unit: /${stats.goals.length || 0},
>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
      max: stats.goals.length || 1,
      progress: stats.goals.length ? (completedGoals / stats.goals.length * 100) : 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Calories Consumed',
      value: totalCaloriesConsumed,
      max: 2500,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  const COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your fitness progress and achievements</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.title}</p>
                    <h3 className="text-2xl font-bold mt-1" style={{ color: theme.primary }}>
                      {card.value} <span className="text-lg text-gray-500 dark:text-gray-400">{card.unit}</span>
                    </h3>
                  </div>
                  <div 
                    className="p-3 rounded-full" 
                    style={{ 
                      backgroundColor: theme.accentLight,
                      color: theme.primary
                    }}
                  >
                    {card.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: theme.primary,
                        width: ${card.progress !== undefined ? card.progress : Math.min(100, (card.value / card.max * 100) || 0)}%
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Overview</h2>
                <div className="flex space-x-2">
                  <button 
<<<<<<< HEAD
                    className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'calories' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
=======
                    className={px-3 py-1 text-sm rounded-lg ${activeTab === 'calories' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}}
>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
                    onClick={() => setActiveTab('calories')}
                  >
                    Calories
                  </button>
                  <button 
<<<<<<< HEAD
                    className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'duration' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
=======
                    className={px-3 py-1 text-sm rounded-lg ${activeTab === 'duration' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}}
>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
                    onClick={() => setActiveTab('duration')}
                  >
                    Duration
                  </button>
                </div>
              </div>
              <div className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.3} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: theme.textSecondary, fontSize: 12 }}
                        axisLine={{ stroke: theme.border }}
                        tickLine={{ stroke: theme.border }}
                      />
                      <YAxis
                        tick={{ fill: theme.textSecondary, fontSize: 12 }}
                        axisLine={{ stroke: theme.border }}
                        tickLine={{ stroke: theme.border }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: theme.darkSurface,
                          borderColor: 'transparent',
                          borderRadius: '0.5rem',
                          color: theme.secondary,
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                        }}
                        cursor={{ fill: theme.accentLight, opacity: 0.3 }}
                      />
                      <Bar 
                        dataKey={activeTab === 'calories' ? 'calories' : 'duration'} 
                        radius={[4, 4, 0, 0]}
                        fill={theme.primary}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg 
                      className="w-16 h-16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: theme.accent }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">No activity data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exercise Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Exercise Distribution</h2>
              <div className="h-64">
                {exerciseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={exerciseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
<<<<<<< HEAD
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {exerciseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
=======
                        label={({ name, percent }) => ${name} ${(percent * 100).toFixed(0)}%}
                      >
                        {exerciseData.map((entry, index) => (
                          <Cell key={cell-${index}} fill={COLORS[index % COLORS.length]} />
>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          background: theme.darkSurface,
                          borderColor: 'transparent',
                          borderRadius: '0.5rem',
                          color: theme.secondary,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg 
                      className="w-16 h-16" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: theme.accent }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">No exercise data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities and Nutrition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Exercises</h2>
                <button 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View All
                </button>
              </div>
              {stats.activities && stats.activities.length > 0 ? (
                <div className="space-y-4">
                  {stats.activities.slice(0, 5).map((activity, index) => (
                    <div
                      key={activity._id || index}
                      className="flex items-center p-4 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div 
                        className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.accentLight }}
                      >
                        <svg 
                          className="h-5 w-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ color: theme.primary }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900 dark:text-white">{activity.type}</h3>
                          <span className="text-sm font-semibold" style={{ color: theme.primary }}>
                            {activity.duration || 'N/A'} mins
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(activity.date || Date.now()).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-medium">
                            <span className="text-gray-500 dark:text-gray-400">Calories: </span>
                            <span style={{ color: theme.success }}>{activity.caloriesBurned || 0}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg 
                    className="w-16 h-16" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: theme.accent }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">No recent exercises</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Nutrition */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Nutrition</h2>
                <button 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View All
                </button>
              </div>
              {stats.nutrition && stats.nutrition.length > 0 ? (
                <div className="space-y-4">
                  {stats.nutrition.slice(0, 5).map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center p-4 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div 
                        className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.successLight }}
                      >
                        <svg 
                          className="h-5 w-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ color: theme.success }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900 dark:text-white">{item.food}</h3>
                          <span className="text-sm font-semibold" style={{ color: theme.success }}>
                            {item.calories || 0} kcal
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.time || 'No time specified'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.mealType || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg 
                    className="w-16 h-16" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: theme.accent }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">No nutrition data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Goals</h2>
              <button 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                View All
              </button>
            </div>
            {stats.goals && stats.goals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.goals.slice(0, 3).map((goal, index) => (
                  <div
                    key={goal._id || index}
                    className="p-4 rounded-xl transition-all duration-300 hover:shadow-md"
                    style={{ 
                      backgroundColor: goal.completed ? theme.successLight : theme.accentLight,
<<<<<<< HEAD
                      borderLeft: `4px solid ${goal.completed ? theme.success : theme.primary}`
=======
                      borderLeft: 4px solid ${goal.completed ? theme.success : theme.primary}
>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
                    }}
                  >
                    <div className="flex items-start">
                      <div 
                        className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-1 ${
                          goal.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        {goal.completed && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className={`font-medium ${
                          goal.completed ? 'text-gray-600 dark:text-gray-300 line-through' : 'text-gray-900 dark:text-white'
                        }`}>
                          {goal.type}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Target: {goal.target}
                        </p>
                        {goal.deadline && (
                          <p className="text-xs mt-2">
                            <span className="text-gray-500 dark:text-gray-400">Due: </span>
                            <span className={`font-medium ${
                              new Date(goal.deadline) < new Date() && !goal.completed ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg 
                  className="w-16 h-16" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: theme.accent }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-500 dark:text-gray-400">No goals set</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
