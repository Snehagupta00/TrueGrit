import { useState, useEffect } from 'react';
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

  // Centralized theme object for consistent colors
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

  const chartData = (stats.activities || []).map((activity, index) => ({
    name: `Day ${index + 1}`,
    calories: activity.caloriesBurned || 0,
  }));

  const totalCaloriesBurned = stats.activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
  const totalCaloriesConsumed = stats.nutrition.reduce((sum, item) => sum + (item.calories || 0), 0);
  const completedGoals = stats.goals.filter(goal => goal.completed).length;
  
  // Define stat cards data
  const statCards = [
    {
      title: 'Calories Burned',
      value: totalCaloriesBurned,
      max: 5000,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
    {
      title: 'Goals Completed',
      value: `${completedGoals} / ${stats.goals.length || 0}`,
      max: 100,
      progress: stats.goals.length ? (completedGoals / stats.goals.length * 100) : 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Mobile Tab Navigation for smaller screens */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {['overview', 'activity', 'nutrition', 'goals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                style={{
                  backgroundColor: activeTab === tab ? theme.accentLight : theme.lightSurface,
                  color: activeTab === tab ? theme.primary : theme.textSecondary
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{card.title}</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1" style={{ color: theme.primary }}>{card.value}</h3>
                  </div>
                  <div 
                    className="p-2 sm:p-3 rounded-full" 
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
                        width: `${card.progress !== undefined ? card.progress : Math.min(100, (card.value / card.max * 100) || 0)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content area - responsive grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chart */}
          <div 
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow transition-all duration-300 hover:shadow-md"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: theme.primary }}>Activity Trends</h2>
                <button 
                  className="text-sm font-medium"
                  style={{ color: theme.accent }}
                >
                  View All
                </button>
              </div>
              {chartData.length > 0 ? (
                <div className="h-60 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
                      <Bar dataKey="calories" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={theme.primary}
                            fillOpacity={0.6 + (index * 0.05)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <svg 
                    className="w-12 h-12 sm:w-16 sm:h-16" 
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

          {/* Recent Activities */}
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow transition-all duration-300 hover:shadow-md"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: theme.primary }}>Recent Activities</h2>
                <button 
                  className="text-sm font-medium"
                  style={{ color: theme.accent }}
                >
                  View All
                </button>
              </div>
              {stats.activities && stats.activities.length > 0 ? (
                <ul className="space-y-3 sm:space-y-4">
                  {stats.activities.slice(0, 5).map((activity, index) => (
                    <li
                      key={activity._id || index}
                      className="flex items-start p-2 sm:p-3 rounded-lg transition-all duration-300 hover:translate-x-1"
                      style={{ backgroundColor: index % 2 === 0 ? 'transparent' : (theme.accentLight + '40') }}
                    >
                      <div 
                        className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.accentLight }}
                      >
                        <svg 
                          className="h-4 w-4 sm:h-5 sm:w-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ color: theme.primary }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-sm sm:text-base" style={{ color: theme.text }}>
                          {activity.type}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {activity.caloriesBurned} kcal • {activity.duration || 'N/A'} mins
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <svg 
                    className="w-12 h-12 sm:w-16 sm:h-16" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: theme.accent }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">No recent activities</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nutrition and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Nutrition Table */}
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: theme.primary }}>Recent Nutrition</h2>
                <button 
                  className="text-sm font-medium"
                  style={{ color: theme.accent }}
                >
                  View All
                </button>
              </div>
              {stats.nutrition && stats.nutrition.length > 0 ? (
                <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Food</th>
                        <th className="py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Calories</th>
                        <th className="py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {stats.nutrition.slice(0, 5).map((item, index) => (
                        <tr
                          key={item._id || index}
                          className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                          style={{ backgroundColor: index % 2 === 0 ? 'transparent' : (theme.accentLight + '20') }}
                        >
                          <td className="py-3 text-xs sm:text-sm font-medium" style={{ color: theme.text }}>{item.food}</td>
                          <td className="py-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.calories} kcal</td>
                          <td className="py-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.time || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <svg 
                    className="w-12 h-12 sm:w-16 sm:h-16" 
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

          {/* Goals */}
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow transition-all duration-300 hover:shadow-md"
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: theme.primary }}>Your Goals</h2>
                <button 
                  className="text-sm font-medium"
                  style={{ color: theme.accent }}
                >
                  View All
                </button>
              </div>
              {stats.goals && stats.goals.length > 0 ? (
                <ul className="space-y-3 sm:space-y-4">
                  {stats.goals.slice(0, 5).map((goal, index) => (
                    <li
                      key={goal._id || index}
                      className="p-3 sm:p-4 rounded-xl transition-all duration-300 hover:translate-x-1 flex items-center"
                      style={{ backgroundColor: theme.accentLight + '40' }}
                    >
                      <div 
                        className={`flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full flex items-center justify-center ${
                          goal.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{ backgroundColor: goal.completed ? theme.success : '#CBD5E1' }}
                      >
                        {goal.completed && (
                          <svg className="h-2 w-2 sm:h-3 sm:w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <p className={`text-xs sm:text-sm font-medium ${
                            goal.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                          }`}>
                            {goal.type}: {goal.target}
                          </p>
                          <span 
                            className="text-xs px-2 py-1 rounded-full mt-1 sm:mt-0 inline-block"
                            style={{ 
                              backgroundColor: goal.completed ? theme.successLight : theme.accentLight,
                              color: goal.completed ? theme.success : theme.primary
                            }}
                          >
                            {goal.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {goal.deadline ? `Due: ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <svg 
                    className="w-12 h-12 sm:w-16 sm:h-16" 
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
    </div>
  );
};

export default Dashboard;