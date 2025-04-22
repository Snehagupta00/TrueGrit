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
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/pushups.mp4',
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
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/squats.mp4',
      defaultTime: 60,
      steps: [
        'Stand with feet shoulder-width apart.',
        'Lower your body as if sitting in a chair.',
        'Keep knees in line with toes.',
        'Return to standing position.'
      ]
    },
    {
      id: 3,
      name: 'Jumping Jacks',
      category: 'cardio',
      description: 'Full-body cardiovascular exercise that improves coordination.',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/jumpingjacks.mp4',
      defaultTime: 45,
      steps: [
        'Stand with feet together and arms at sides.',
        'Jump while spreading legs and raising arms overhead.',
        'Jump again to return to starting position.',
        'Repeat continuously at a steady pace.'
      ]
    },
    {
      id: 4,
      name: 'Plank',
      category: 'core',
      description: 'Isometric exercise that strengthens the entire core.',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/plank.mp4',
      defaultTime: 30,
      steps: [
        'Start in push-up position but rest on forearms.',
        'Keep body straight from head to heels.',
        'Engage core muscles and hold position.',
        'Avoid letting hips sag or rise too high.'
      ]
    },
    {
      id: 5,
      name: 'Burpees',
      category: 'cardio',
      description: 'Full-body explosive exercise that combines strength and cardio.',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/burpees.mp4',
      defaultTime: 45,
      steps: [
        'Start standing, then drop into squat position.',
        'Kick feet back into push-up position.',
        'Do a push-up, then return to squat position.',
        'Jump up explosively with arms overhead.'
      ]
    },
    {
      id: 6,
      name: 'Lunges',
      category: 'strength',
      description: 'Lower body exercise that improves balance and leg strength.',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/lunges.mp4',
      defaultTime: 60,
      steps: [
        'Stand tall with feet hip-width apart.',
        'Step forward with one leg and lower hips.',
        'Keep front knee above ankle and back knee just off floor.',
        'Push back to starting position and alternate legs.'
      ]
    },
    {
      id: 7,
      name: 'Bicycle Crunches',
      category: 'core',
      description: 'Dynamic core exercise that targets obliques and rectus abdominis.',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/bicyclecrunches.mp4',
      defaultTime: 45,
      steps: [
        'Lie on back with hands behind head and legs raised.',
        'Bring right elbow to left knee while extending right leg.',
        'Switch sides, bringing left elbow to right knee.',
        'Continue alternating in a pedaling motion.'
      ]
    },
    {
      id: 8,
      name: 'Mountain Climbers',
      category: 'cardio',
      description: 'High-intensity exercise that works core and improves endurance.',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/mountainclimbers.mp4',
      defaultTime: 45,
      steps: [
        'Start in push-up position with hands under shoulders.',
        'Quickly bring one knee toward chest then switch legs.',
        'Keep core engaged and maintain steady breathing.',
        'Move at a controlled but brisk pace.'
      ]
    },
    {
      id: 9,
      name: 'Glute Bridge',
      category: 'strength',
      description: 'Exercise that targets glutes and hamstrings while protecting the lower back.',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/glutebridge.mp4',
      defaultTime: 45,
      steps: [
        'Lie on back with knees bent and feet flat on floor.',
        'Lift hips until body forms straight line from shoulders to knees.',
        'Squeeze glutes at the top of the movement.',
        'Lower hips back down with control.'
      ]
    },
    {
      id: 10,
      name: 'Russian Twists',
      category: 'core',
      description: 'Rotational core exercise that strengthens obliques.',
      imageUrl: '/api/placeholder/400/300',
      videoUrl: 'https://example.com/videos/russiantwists.mp4',
      defaultTime: 45,
      steps: [
        'Sit on floor with knees bent and lean back slightly.',
        'Hold hands together or with weight and rotate torso side to side.',
        'Keep core engaged throughout the movement.',
        'For more challenge, lift feet off the ground.'
      ]
    }
  ];
  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter((exercise) => exercise.category === selectedCategory);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 lg:p-16 max-w-6xl mx-auto"
    >
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary dark:text-primary-light mb-4">
          Workout Exercise Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Customize your workout routine with these exercises
        </p>
      </header>
      <div className="flex justify-center mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 inline-flex space-x-3">
          {['all', 'strength', 'cardio', 'core'].map((category) => (
            <button
              key={category}
              className={`px-5 py-2 rounded-md font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  const [showVideo, setShowVideo] = useState(false);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  const handleStart = async () => {
    try {
      await api.post('/api/activity', {
        type: exercise.name,
        duration: customTime / 60,
        intensity: 'medium',
        calories: Math.round((customTime / 60) * 100), // Example calculation
      });
      toast.success(`${exercise.name} logged for ${formatTime(customTime)}!`);
    } catch (error) {
      toast.error('Failed to log exercise.');
      console.error('Error logging exercise:', error);
    }
  };
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative h-56 overflow-hidden">
        {showVideo ? (
          <div className="h-full w-full flex items-center justify-center bg-black text-white">
            <div className="text-center">
              <p className="text-xl mb-2">Video Player</p>
              <p className="text-sm opacity-80">{exercise.name} demonstration</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <div className="text-center">
              <p className="text-xl mb-2">Exercise Image</p>
              <p className="text-sm opacity-80">{exercise.name}</p>
            </div>
          </div>
        )}
        <button
          className={`absolute top-2 right-2 p-2 rounded-full text-xs font-bold ${
            showVideo ? 'bg-primary' : 'bg-gray-800'
          } text-white`}
          onClick={() => setShowVideo(!showVideo)}
        >
          {showVideo ? 'Show Image' : 'Show Video'}
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{exercise.name}</h3>
        <div className="flex items-center mb-2">
          <span
            className={`px-2 py-1 text-xs rounded-full font-semibold ${
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
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
            <button
              className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 w-8 h-8 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              onClick={() => setCustomTime(Math.max(15, customTime - 15))}
            >
              -
            </button>
            <div className="px-4 py-1 text-gray-800 dark:text-gray-100 font-semibold">
              {formatTime(customTime)}
            </div>
            <button
              className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 w-8 h-8 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              onClick={() => setCustomTime(customTime + 15)}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            className="flex-1 py-3 px-5 bg-primary text-white text-lg rounded-md hover:bg-primary-dark transition-all"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide' : 'Instructions'}
          </button>
          <button
            className="flex-1 py-3 px-5 bg-secondary text-white text-lg rounded-md hover:bg-secondary-light transition-all"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-5 border-t pt-4"
          >
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">How to perform:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
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