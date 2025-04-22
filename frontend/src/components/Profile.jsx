import { useState, useEffect } from 'react';
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        Please sign in to view your profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 transition-all duration-300">
          <div className="relative">
            <img
              src={user.imageUrl || 'https://via.placeholder.com/80'}
              alt={`${user.firstName} ${user.lastName}'s profile`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-primary dark:border-primary shadow transition-all duration-300 hover:shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent break-words">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base break-all">
                {user.emailAddresses[0]?.emailAddress || 'No email provided'}
              </p>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full whitespace-nowrap">Premium</span>
            </div>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Profile Form and Nutrition History */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 md:mb-8">
                Update Profile
              </h2>
              <div className="space-y-4 md:space-y-6">
                <div className="group">
                  <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    className="w-full p-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter your weight"
                  />
                </div>
                <div className="group">
                  <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    className="w-full p-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter your height"
                  />
                </div>
                <div className="group">
                  <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Fitness Level
                  </label>
                  <div className="relative">
                    <select
                      value={profile.fitnessLevel}
                      onChange={(e) => setProfile({ ...profile, fitnessLevel: e.target.value })}
                      className="w-full p-4 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">Select Fitness Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white p-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform"
                >
                  Update Profile
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Nutrition History
                </h2>
                <button className="text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                </div>
              ) : history.length > 0 ? (
                <div className="max-h-[32rem] overflow-y-auto pr-2 custom-scrollbar">
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                    {history.map((item) => (
                      <li key={item._id} className="py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 px-3 rounded-xl transition-all duration-200 group">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full group-hover:scale-110 transition-transform"></div>
                            <span className="font-medium text-gray-900 dark:text-white">{item.food}</span>
                          </div>
                          <span className="text-gray-600 dark:text-gray-300 font-semibold">{item.calories} kcal</span>
                        </div>
                        <div className="ml-5 mt-2 flex flex-wrap gap-2 text-sm">
                          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium">
                            Carbs: {item.carbs || 0}g
                          </span>
                          <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium">
                            Protein: {item.protein || 0}g
                          </span>
                          <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg font-medium">
                            Fats: {item.fats || 0}g
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="w-24 h-24 mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center group hover:scale-110 transition-transform">
                    <svg className="w-12 h-12 text-indigo-600 dark:text-indigo-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-center max-w-xs text-gray-600 dark:text-gray-300">No nutrition data available. Start logging your meals to get personalized recommendations.</p>
                  <button className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Add First Meal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stats and Recommendations */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center items-center bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-16">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : recommendations.diet && recommendations.workout ? (
              <>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="h-8 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                      Your Stats
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50/90 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 p-5 sm:p-6 rounded-2xl border border-blue-100/50 dark:border-blue-800/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 group-hover:text-primary transition-colors">BMI</div>
                        <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary flex items-end gap-2">
                          {recommendations.stats.bmi}
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-normal mb-1">kg/m²</span>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-green-50/90 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 p-5 sm:p-6 rounded-2xl border border-green-100/50 dark:border-green-800/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 group-hover:text-secondary transition-colors">Daily Calories</div>
                        <div className="text-2xl sm:text-3xl font-bold text-secondary dark:text-secondary flex items-end gap-2">
                          {recommendations.stats.avgCalories}
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-normal mb-1">kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50/90 to-purple-50/50 dark:from-purple-900/20 dark:to-purple-900/10 p-5 sm:p-6 rounded-2xl border border-purple-100/50 dark:border-purple-800/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 group-hover:text-primary transition-colors">Protein</div>
                        <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary flex items-end gap-2">
                          {recommendations.stats.avgProtein}
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-normal mb-1">g</span>
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-50/90 to-yellow-50/50 dark:from-yellow-900/20 dark:to-yellow-900/10 p-5 sm:p-6 rounded-2xl border border-yellow-100/50 dark:border-yellow-800/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 group-hover:text-secondary transition-colors">Carbs</div>
                        <div className="text-2xl sm:text-3xl font-bold text-secondary dark:text-secondary flex items-end gap-2">
                          {recommendations.stats.avgCarbs}
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-normal mb-1">g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-secondary bg-clip-text text-transparent">
                      Diet Recommendations
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/5 dark:bg-secondary/10 rounded-2xl border border-secondary/20">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        Goal
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 pl-4">{recommendations.diet.goal}</p>
                    </div>

                    <div className="p-4 bg-secondary/5 dark:bg-secondary/10 rounded-2xl border border-secondary/20">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        Calories
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 pl-4">{recommendations.diet.calories}</p>
                    </div>

                    <div className="p-4 bg-secondary/5 dark:bg-secondary/10 rounded-2xl border border-secondary/20">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        Macronutrient Focus
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 pl-4">{recommendations.diet.macros}</p>
                    </div>

                    <div className="p-4 bg-secondary/5 dark:bg-secondary/10 rounded-2xl border border-secondary/20">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        Suggested Foods
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {recommendations.diet.suggestions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <svg className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                      Workout Recommendations
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Frequency
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 pl-4">{recommendations.workout.frequency}</p>
                    </div>

                    <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Intensity
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 pl-4">{recommendations.workout.intensity}</p>
                    </div>

                    <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Focus
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 pl-4">{recommendations.workout.focus}</p>
                    </div>

                    <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Suggested Activities
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {recommendations.workout.suggestions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">
                  Recommendations
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Complete your profile information to receive personalized diet and workout recommendations based on your data.
                </p>
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <h3 className="font-semibold text-primary dark:text-primary mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Getting Started
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">1</div>
                      <p className="text-gray-700 dark:text-gray-300">Enter your weight and height</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">2</div>
                      <p className="text-gray-700 dark:text-gray-300">Select your fitness level</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">3</div>
                      <p className="text-gray-700 dark:text-gray-300">Click "Update Profile" to save your information</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">4</div>
                      <p className="text-gray-700 dark:text-gray-300">Log your nutrition data to get detailed recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;