import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        setHistory(nutritionRes.data);
        generateRecommendations(profileRes.data, nutritionRes.data);
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
    if (nutritionData && nutritionData.length > 0) {
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
        avgCalories: totalCalories.toFixed(0),
        avgProtein: totalProtein.toFixed(1),
        avgCarbs: totalCarbs.toFixed(1),
        avgFats: totalFats.toFixed(1),
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

  if (!user) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Please sign in to view your profile</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-6">
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <h1 className="text-2xl font-bold text-primary dark:text-primary-light">
          {user.firstName} {user.lastName}'s Profile
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
              <input
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="Enter your weight"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="Enter your height"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Fitness Level</label>
              <select
                value={profile.fitnessLevel}
                onChange={(e) => setProfile({ ...profile, fitnessLevel: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">Select</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors"
            >
              Update Profile
            </button>
          </form>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Nutrition History</h2>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : history.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {history.map((item) => (
                    <li key={item._id} className="py-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{item.food}</span>
                        <span className="text-gray-600 dark:text-gray-400">{item.calories} kcal</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        C: {item.carbs}g • P: {item.protein}g • F: {item.fats}g
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No nutrition data available. Start logging your meals to get personalized recommendations.
              </p>
            )}
          </div>
        </div>
        <div>
          {recommendations.diet && recommendations.workout ? (
            <>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Your Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
                    <div className="text-sm text-gray-600 dark:text-gray-400">BMI</div>
                    <div className="text-xl font-bold text-primary dark:text-primary-light">
                      {recommendations.stats.bmi}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Daily Calories</div>
                    <div className="text-xl font-bold text-secondary dark:text-secondary-light">
                      {recommendations.stats.avgCalories || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-md">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Protein</div>
                    <div className="text-xl font-bold text-primary dark:text-primary-light">
                      {recommendations.stats.avgProtein || 'N/A'}g
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Carbs</div>
                    <div className="text-xl font-bold text-primary dark:text-primary-light">
                      {recommendations.stats.avgCarbs || 'N/A'}g
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                  <span className="text-secondary mr-2">●</span>Personalized Diet Recommendations
                </h2>
                <div className="mb-3">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Goal</h3>
                  <p className="text-gray-600 dark:text-gray-300">{recommendations.diet.goal}</p>
                </div>
                <div className="mb-3">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Calories</h3>
                  <p className="text-gray-600 dark:text-gray-300">{recommendations.diet.calories}</p>
                </div>
                <div className="mb-3">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Macronutrient Focus</h3>
                  <p className="text-gray-600 dark:text-gray-300">{recommendations.diet.macros}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Suggested Foods</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                    {recommendations.diet.suggestions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                  <span className="text-primary mr-2">●</span>Personalized Workout Recommendations
                </h2>
                <div className="mb-3">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Frequency</h3>
                  <p className="text-gray-600 dark:text-gray-300">{recommendations.workout.frequency}</p>
                </div>
                <div className="mb-3">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Intensity</h3>
                  <p className="text-gray-600 dark:text-gray-300">{recommendations.workout.intensity}</p>
                </div>
                <div className="mb-3">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Focus</h3>
                  <p className="text-gray-600 dark:text-gray-300">{recommendations.workout.focus}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Suggested Activities</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                    {recommendations.workout.suggestions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Recommendations</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Complete your profile information to receive personalized diet and workout recommendations based on your data.
              </p>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
                <h3 className="font-medium text-primary dark:text-primary-light">Getting Started</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Enter your weight and height</li>
                  <li>Select your fitness level</li>
                  <li>Add nutrition data to improve recommendations</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;