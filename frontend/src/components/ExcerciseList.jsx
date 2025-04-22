import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';

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
      className="p-6 lg:p-12 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary dark:text-primary mb-4">
          Workout Exercise Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Customize your workout routine with our curated exercises.
        </p>
      </header>
      <div className="flex justify-center mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 inline-flex space-x-3">
          {['all', 'strength', 'cardio', 'core'].map((category) => (
            <button
              key={category}
              className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCategory(category)}
              aria-current={selectedCategory === category ? 'true' : 'false'}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </motion.div>
  );
}

function ExerciseCard({ exercise }) {
  const [expanded, setExpanded] = useState(false);
  const [customTime, setCustomTime] = useState(exercise.defaultTime);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handleStart = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/api/activity', {
        type: exercise.name,
        duration: customTime / 60,
        intensity: 'medium',
        calories: Math.round((customTime / 60) * 100),
      });
      toast.success(`${exercise.name} logged for ${formatTime(customTime)}!`);
    } catch (error) {
      toast.error('Failed to log exercise.');
      console.error('Error logging exercise:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative h-56 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p className="absolute bottom-4 text-sm text-gray-600 dark:text-gray-300">{exercise.name}</p>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{exercise.name}</h3>
        <div className="flex items-center mb-3">
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              exercise.category === 'strength'
                ? 'bg-blue-100 text-blue-800'
                : exercise.category === 'cardio'
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{exercise.description}</p>
        <div className="mb-4 flex items-center">
          <span className="text-gray-700 dark:text-gray-300 font-medium mr-3">Duration:</span>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <button
              className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 w-8 h-8 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              onClick={() => setCustomTime(Math.max(15, customTime - 15))}
              aria-label="Decrease duration"
            >
              -
            </button>
            <div className="px-4 py-1 text-gray-900 dark:text-gray-100 font-semibold">
              {formatTime(customTime)}
            </div>
            <button
              className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 w-8 h-8 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              onClick={() => setCustomTime(customTime + 15)}
              aria-label="Increase duration"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 px-5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? 'Hide' : 'Instructions'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 px-5 text-white rounded-lg transition-all font-semibold ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-secondary-dark'
            }`}
            onClick={handleStart}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging...' : 'Start'}
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
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
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