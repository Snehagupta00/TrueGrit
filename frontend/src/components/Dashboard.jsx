import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  const { getToken } = useAuth();

  useEffect(() => {
    // Set auth token whenever component mounts
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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    );
  }

  // Ensure activities exist before mapping them
  const chartData = (stats.activities || []).map((activity, index) => ({
    name: `Day ${index + 1}`,
    calories: activity.caloriesBurned || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          {stats.activities && stats.activities.length > 0 ? (
            <ul>
              {stats.activities.slice(0, 5).map((activity, index) => (
                <li key={activity._id || index} className="text-gray-700 dark:text-gray-300">
                  {activity.type} - {activity.caloriesBurned} kcal
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Nutrition Summary</h2>
          {stats.nutrition && stats.nutrition.length > 0 ? (
            <ul>
              {stats.nutrition.slice(0, 5).map((item, index) => (
                <li key={item._id || index} className="text-gray-700 dark:text-gray-300">
                  {item.food} - {item.calories} kcal
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No nutrition data</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Goals</h2>
          {stats.goals && stats.goals.length > 0 ? (
            <ul>
              {stats.goals.slice(0, 5).map((goal, index) => (
                <li key={goal._id || index} className="text-gray-700 dark:text-gray-300">
                  {goal.type}: {goal.target}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No goals set</p>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Activity Trends</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#1E3A8A" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No activity data available for chart
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;