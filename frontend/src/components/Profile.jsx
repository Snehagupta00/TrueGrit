import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    weight: '',
    height: '',
    fitnessLevel: '',
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState({
    diet: null,
    workout: null,
    stats: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [profileRes, nutritionRes] = await Promise.all([
          api.get('/api/profile'),
          api.get('/api/nutrition'),
        ]);
        if (profileRes.data) {
          setProfile(profileRes.data);
        }
        setHistory(nutritionRes.data || []);
        generateRecommendations(profileRes.data, nutritionRes.data || []);
      } catch (error) {
        toast.error('Failed to load profile data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const generateRecommendations = (profileData, nutritionData) => {
    if (!profileData.weight || !profileData.height || !profileData.fitnessLevel) {
      return;
    }

    const heightInMeters = profileData.height / 100;
    const bmi = profileData.weight / (heightInMeters * heightInMeters);

    let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0;
    if (nutritionData.length > 0) {
      nutritionData.forEach((item) => {
        totalCalories += Number(item.calories || 0);
        totalProtein += Number(item.protein || 0);
        totalCarbs += Number(item.carbs || 0);
        totalFats += Number(item.fats || 0);
      });
      const entries = nutritionData.length;
      totalCalories /= entries;
      totalProtein /= entries;
      totalCarbs /= entries;
      totalFats /= entries;
    }

    let dietRec = {};
    if (bmi < 18.5) {
      dietRec = {
        goal: 'Weight gain',
        calories: 'Increase daily caloric intake by 300-500 calories',
        macros: 'Focus on protein (1.6-2g per kg body weight) and healthy fats',
        suggestions: [
          'Protein-rich foods like chicken, fish, eggs, and legumes',
          'Healthy fats from nuts, avocados, and olive oil',
          'Complex carbs from whole grains, sweet potatoes, and fruits',
        ],
      };
    } else if (bmi >= 25) {
      dietRec = {
        goal: 'Weight management',
        calories: 'Maintain a moderate caloric deficit of 300-500 calories',
        macros: 'Higher protein intake (1.6-2g per kg) and moderate carbs',
        suggestions: [
          'Lean proteins like chicken breast, turkey, and fish',
          'High-fiber foods like vegetables, berries, and legumes',
          'Healthy fats in moderation from nuts, seeds, and avocados',
        ],
      };
    } else {
      dietRec = {
        goal: 'Maintenance and performance',
        calories: 'Maintain current caloric intake with focus on quality',
        macros: 'Balanced macronutrient distribution',
        suggestions: [
          'Varied protein sources including plant and animal options',
          'Complex carbohydrates for sustained energy',
          'Balanced fat intake from various sources',
        ],
      };
    }

    let workoutRec = {};
    switch (profileData.fitnessLevel) {
      case 'beginner':
        workoutRec = {
          frequency: '3-4 days per week',
          intensity: 'Low to moderate',
          focus: 'Building foundational strength and establishing habits',
          suggestions: [
            'Full-body workouts focusing on compound movements',
            'Bodyweight exercises like squats, pushups, and lunges',
            'Moderate cardio sessions (20-30 min) like walking or cycling',
          ],
        };
        break;
      case 'intermediate':
        workoutRec = {
          frequency: '4-5 days per week',
          intensity: 'Moderate to high',
          focus: 'Building muscle and improving cardiovascular fitness',
          suggestions: [
            'Split routines (upper/lower or push/pull/legs)',
            'Incorporate progressive overload with weights',
            'Mix of strength training and interval cardio',
          ],
        };
        break;
      case 'advanced':
        workoutRec = {
          frequency: '5-6 days per week',
          intensity: 'High with planned deload periods',
          focus: 'Specific training goals and performance optimization',
          suggestions: [
            'Periodized training programs with volume/intensity manipulation',
            'Specialized training splits based on goals',
            'Strategic cardio and recovery protocols',
          ],
        };
        break;
      default:
        workoutRec = {
          frequency: 'Start with 2-3 days per week',
          intensity: 'Low to moderate',
          focus: 'Building consistency and foundational fitness',
          suggestions: [
            'Focus on learning proper form with basic movements',
            'Mix of cardio and basic strength exercises',
            'Gradually increase duration and intensity as fitness improves',
          ],
        };
    }

    setRecommendations({
      diet: dietRec,
      workout: workoutRec,
      stats: {
        bmi: bmi.toFixed(1),
        avgCalories: totalCalories.toFixed(0) || 'N/A',
        avgProtein: totalProtein.toFixed(1) || 'N/A',
        avgCarbs: totalCarbs.toFixed(1) || 'N/A',
        avgFats: totalFats.toFixed(1) || 'N/A',
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/profile', profile);
      generateRecommendations(profile, history);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
      console.error('Error updating profile:', error);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#3B82F6', transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: '#D1D5DB', transition: { duration: 0.2 } },
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
      >
        Please sign in to view your profile
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 flex items-center gap-6"
        >
          <motion.img
            src={user.imageUrl || 'https://via.placeholder.com/80'}
            alt={`${user.firstName} ${user.lastName}'s profile`}
            className="w-20 h-20 rounded-full object-cover border-4 border-primary dark:border-primary shadow-sm"
            whileHover={{ scale: 1.1 }}
          />
          <div>
            <h1 className="text-3xl font-extrabold text-primary dark:text-primary">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user.emailAddresses[0]?.emailAddress || 'No email provided'}</p>
          </div>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column: Profile Form and Nutrition History */}
          <div className="space-y-8">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Update Profile</h2>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                  <motion.input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
                    placeholder="Enter your weight"
                    whileFocus="focus"
                    initial="blur"
                    variants={inputVariants}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
                  <motion.input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
                    placeholder="Enter your height"
                    whileFocus="focus"
                    initial="blur"
                    variants={inputVariants}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fitness Level</label>
                  <motion.select
                    value={profile.fitnessLevel}
                    onChange={(e) => setProfile({ ...profile, fitnessLevel: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 transition-colors"
                    whileFocus="focus"
                    initial="blur"
                    variants={inputVariants}
                  >
                    <option value="">Select Fitness Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </motion.select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                >
                  Update Profile
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nutrition History</h2>
              {loading ? (
                <div className="flex justify-center py-4">
                  <motion.div
                    className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              ) : history.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {history.map((item) => (
                      <motion.li
                        key={item._id}
                        className="py-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{item.food}</span>
                          <span className="text-gray-600 dark:text-gray-400">{item.calories} kcal</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          C: {item.carbs || 0}g • P: {item.protein || 0}g • F: {item.fats || 0}g
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No nutrition data available. Start logging your meals to get personalized recommendations.</p>
                </div>
              )}
            </motion.div>
          </div>
          {/* Right Column: Stats and Recommendations */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-4">
                <motion.div
                  className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            ) : recommendations.diet && recommendations.workout ? (
              <>
                <motion.div
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Stats</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-sm text-gray-600 dark:text-gray-400">BMI</div>
                      <div className="text-xl font-bold text-primary dark:text-primary">
                        {recommendations.stats.bmi}
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-green-50 dark:bg-green-900 p-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Daily Calories</div>
                      <div className="text-xl font-bold text-secondary dark:text-secondary">
                        {recommendations.stats.avgCalories}
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Protein</div>
                      <div className="text-xl font-bold text-primary dark:text-primary">
                        {recommendations.stats.avgProtein}g
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Carbs</div>
                      <div className="text-xl font-bold text-primary dark:text-primary">
                        {recommendations.stats.avgCarbs}g
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    <span className="text-secondary mr-2">●</span>Personalized Diet Recommendations
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Goal</h3>
                      <p className="text-gray-600 dark:text-gray-300">{recommendations.diet.goal}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Calories</h3>
                      <p className="text-gray-600 dark:text-gray-300">{recommendations.diet.calories}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Macronutrient Focus</h3>
                      <p className="text-gray-600 dark:text-gray-300">{recommendations.diet.macros}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Suggested Foods</h3>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                        {recommendations.diet.suggestions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    <span className="text-primary mr-2">●</span>Personalized Workout Recommendations
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Frequency</h3>
                      <p className="text-gray-600 dark:text-gray-300">{recommendations.workout.frequency}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Intensity</h3>
                      <p className="text-gray-600 dark:text-gray-300">{recommendations.workout.intensity}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Focus</h3>
                      <p className="text-gray-600 dark:text-gray-300">{recommendations.workout.focus}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Suggested Activities</h3>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                        {recommendations.workout.suggestions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ x: 20 }}
                animate={{ x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recommendations</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Complete your profile information to receive personalized diet and workout recommendations based on your data.
                </p>
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h3 className="font-medium text-primary dark:text-primary mb-2">Getting Started</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Enter your weight and height</li>
                    <li>Select your fitness level</li>
                    <li>Add nutrition data to improve recommendations</li>
                  </ol>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;