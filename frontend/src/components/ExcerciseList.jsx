<<<<<<< HEAD
=======

>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
import { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';

const exerciseImages = {
  'Push-ups': 'https://www.muscletech.in/wp-content/uploads/2025/01/push-up-exercises.webp',
  'Squats': 'https://media.istockphoto.com/id/1917187221/photo/group-of-sporty-friends-doing-squats-with-instructor-in-a-gym.jpg?s=612x612&w=0&k=20&c=QLWCh9URLOtNn9YcrGKK_T3GtbmZNuTjRdcUEjTLPqs=',
  'Jumping Jacks': 'https://cdn.prod.website-files.com/62e18da95149ec2ee0d87b5b/65b0d643eb8c14b2ff3c6eaf_thumbnail-image-65ae476a9d643.webp',
  'Plank': 'https://hips.hearstapps.com/hmg-prod/images/athletic-man-doing-the-plank-for-abs-and-core-royalty-free-image-1708006586.jpg',
  'Burpees': 'https://cdn.shopify.com/s/files/1/0645/8762/8770/files/Fitness-Fix-Burpee_480x480.jpg?v=1712301822',
  'Lunges': 'https://images.healthshots.com/healthshots/en/uploads/2024/05/02174153/Lunges.jpg',
  'Bicycle Crunches': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0p8CTy-XN_UdKdJ1fznz8pQThqd3eZJSyg&s',
  'Mountain Climbers': 'https://images.ctfassets.net/hjcv6wdwxsdz/1WCM5ZFQUTUvuDohwMqr3B/f9b0d7e0eefafd21806937e72b2f867e/mountain-climbers.png?w=800&h=588&q=50&fm=avif',
  'Glute Bridge': 'https://i.ytimg.com/vi/O9j_DU_4KXs/mqdefault.jpg',
  'Russian Twists': 'https://t3.ftcdn.net/jpg/04/35/06/64/360_F_435066484_f56vSwQ0hzPeXQaCF4LaS2Se9hsGK8hp.jpg',
};

function ExerciseApp() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const exercises = [
    {
      id: 1,
      name: 'Push-ups',
      category: 'strength',
      description: 'Classic upper body exercise that targets chest, shoulders, and triceps.',
      defaultTime: 60,
      steps: [
        'Start in plank position with hands slightly wider than shoulders.',
        'Lower your body until chest nearly touches the floor.',
        'Push back up to starting position.',
        'Keep your core tight throughout the movement.',
      ],
    },
    {
      id: 2,
      name: 'Squats',
      category: 'strength',
      description: 'Lower body exercise targeting quadriceps, hamstrings, and glutes.',
      defaultTime: 60,
      steps: [
        'Stand with feet shoulder-width apart.',
        'Lower your body as if sitting in a chair.',
        'Keep knees in line with toes.',
        'Return to standing position.',
      ],
    },
    {
      id: 3,
      name: 'Jumping Jacks',
      category: 'cardio',
      description: 'Full-body cardiovascular exercise that improves coordination.',
      defaultTime: 45,
      steps: [
        'Stand with feet together and arms at sides.',
        'Jump while spreading legs and raising arms overhead.',
        'Jump again to return to starting position.',
        'Repeat continuously at a steady pace.',
      ],
    },
    {
      id: 4,
      name: 'Plank',
      category: 'core',
      description: 'Isometric exercise that strengthens the entire core.',
      defaultTime: 30,
      steps: [
        'Start in push-up position but rest on forearms.',
        'Keep body straight from head to heels.',
        'Engage core muscles and hold position.',
        'Avoid letting hips sag or rise too high.',
      ],
    },
    {
      id: 5,
      name: 'Burpees',
      category: 'cardio',
      description: 'Full-body explosive exercise that combines strength and cardio.',
      defaultTime: 45,
      steps: [
        'Start standing, then drop into squat position.',
        'Kick feet back into push-up position.',
        'Do a push-up, then return to squat position.',
        'Jump up explosively with arms overhead.',
      ],
    },
    {
      id: 6,
      name: 'Lunges',
      category: 'strength',
      description: 'Lower body exercise that improves balance and leg strength.',
      defaultTime: 60,
      steps: [
        'Stand tall with feet hip-width apart.',
        'Step forward with one leg and lower hips.',
        'Keep front knee above ankle and back knee just off floor.',
        'Push back to starting position and alternate legs.',
      ],
    },
    {
      id: 7,
      name: 'Bicycle Crunches',
      category: 'core',
      description: 'Dynamic core exercise that targets obliques and rectus abdominis.',
      defaultTime: 45,
      steps: [
        'Lie on back with hands behind head and legs raised.',
        'Bring right elbow to left knee while extending right leg.',
        'Switch sides, bringing left elbow to right knee.',
        'Continue alternating in a pedaling motion.',
      ],
    },
    {
      id: 8,
      name: 'Mountain Climbers',
      category: 'cardio',
      description: 'High-intensity exercise that works core and improves endurance.',
      defaultTime: 45,
      steps: [
        'Start in push-up position with hands under shoulders.',
        'Quickly bring one knee toward chest then switch legs.',
        'Keep core engaged and maintain steady breathing.',
        'Move at a controlled but brisk pace.',
      ],
    },
    {
      id: 9,
      name: 'Glute Bridge',
      category: 'strength',
      description: 'Exercise that targets glutes and hamstrings while protecting the lower back.',
      defaultTime: 45,
      steps: [
        'Lie on back with knees bent and feet flat on floor.',
        'Lift hips until body forms straight line from shoulders to knees.',
        'Squeeze glutes at the top of the movement.',
        'Lower hips back down with control.',
      ],
    },
    {
      id: 10,
      name: 'Russian Twists',
      category: 'core',
      description: 'Rotational core exercise that strengthens obliques.',
      defaultTime: 45,
      steps: [
        'Sit on floor with knees bent and lean back slightly.',
        'Hold hands together or with weight and rotate torso side to side.',
        'Keep core engaged throughout the movement.',
        'For more challenge, lift feet off the ground.',
      ],
    },
  ];

  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter((exercise) => exercise.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <header className="sticky top-0 z-10 px-6 py-8 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Workout Exercises
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto text-center">
            Explore and track your favorite exercises.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 inline-flex space-x-2 overflow-x-auto max-w-full scrollbar-hide">
              {['all', 'strength', 'cardio', 'core'].map((category) => (
                <button
                  key={category}
                  className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  aria-current={selectedCategory === category ? 'true' : 'false'}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function ExerciseCard({ exercise }) {
  const [expanded, setExpanded] = useState(false);
  const [customTime, setCustomTime] = useState(exercise.defaultTime);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(customTime);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return ${minutes}:${seconds < 10 ? '0' + seconds : seconds};
  };

  const handleStart = async () => {
    if (isActive) {
      setIsActive(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/activity', {
        type: exercise.name,
        duration: customTime / 60,
        intensity: 'medium',
        calories: Math.round((customTime / 60) * 100),
      });
<<<<<<< HEAD
      toast.success(`${exercise.name} logged for ${formatTime(customTime)}!`);
=======
      toast.success(${exercise.name} logged for ${formatTime(customTime)}!);
>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
      setIsActive(true);
      setTimeLeft(customTime);
    } catch (error) {
      toast.error('Failed to log exercise.');
      console.error('Error logging exercise:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
<<<<<<< HEAD
      toast.success(`Time's up! Great job with ${exercise.name}!`);
=======
      toast.success(Time's up! Great job with ${exercise.name}!);
>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, exercise.name]);

  const progress = (timeLeft / customTime) * 100;

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={exerciseImages[exercise.name] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80'} 
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
        {isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-4xl font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
<<<<<<< HEAD
            style={{ width: `${progress}%` }}
=======
            style={{ width: ${progress}% }}
>>>>>>> 75ccdc56a8ed6a0017fdbe16c96b65841f053ae0
          ></div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{exercise.name}</h3>
        <div className="flex items-center mb-3">
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              exercise.category === 'strength'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : exercise.category === 'cardio'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{exercise.description}</p>
        <div className="mb-4 flex items-center">
          <span className="text-gray-900 dark:text-white font-medium mr-3">Duration:</span>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <button
              className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={() => setCustomTime(Math.max(15, customTime - 15))}
              aria-label="Decrease duration"
              disabled={isActive}
            >
              -
            </button>
            <div className="px-4 py-1 text-gray-900 dark:text-white font-semibold">
              {formatTime(customTime)}
            </div>
            <button
              className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={() => setCustomTime(customTime + 15)}
              aria-label="Increase duration"
              disabled={isActive}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? 'Hide' : 'Instructions'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 px-5 text-white rounded-lg transition-all font-semibold ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
            }`}
            onClick={handleStart}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging...' : isActive ? 'Stop' : 'Start'}
          </motion.button>
        </div>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">How to perform:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              {exercise.steps.map((step, index) => (
                <li key={index} className="mb-2">{step}</li>
              ))}
            </ol>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ExerciseApp;
