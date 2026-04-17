import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { Dumbbell, Timer, Play, Square, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';

const exerciseImages = {
  'Push-ups':         'https://www.muscletech.in/wp-content/uploads/2025/01/push-up-exercises.webp',
  'Squats':           'https://media.istockphoto.com/id/1917187221/photo/group-of-sporty-friends-doing-squats-with-instructor-in-a-gym.jpg?s=612x612&w=0&k=20&c=QLWCh9URLOtNn9YcrGKK_T3GtbmZNuTjRdcUEjTLPqs=',
  'Jumping Jacks':    'https://cdn.prod.website-files.com/62e18da95149ec2ee0d87b5b/65b0d643eb8c14b2ff3c6eaf_thumbnail-image-65ae476a9d643.webp',
  'Plank':            'https://hips.hearstapps.com/hmg-prod/images/athletic-man-doing-the-plank-for-abs-and-core-royalty-free-image-1708006586.jpg',
  'Burpees':          'https://cdn.shopify.com/s/files/1/0645/8762/8770/files/Fitness-Fix-Burpee_480x480.jpg?v=1712301822',
  'Lunges':           'https://images.healthshots.com/healthshots/en/uploads/2024/05/02174153/Lunges.jpg',
  'Bicycle Crunches': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0p8CTy-XN_UdKdJ1fznz8pQThqd3eZJSyg&s',
  'Mountain Climbers':'https://images.ctfassets.net/hjcv6wdwxsdz/1WCM5ZFQUTUvuDohwMqr3B/f9b0d7e0eefafd21806937e72b2f867e/mountain-climbers.png?w=800&h=588&q=50&fm=avif',
  'Glute Bridge':     'https://i.ytimg.com/vi/O9j_DU_4KXs/mqdefault.jpg',
  'Russian Twists':   'https://t3.ftcdn.net/jpg/04/35/06/64/360_F_435066484_f56vSwQ0hzPeXQaCF4LaS2Se9hsGK8hp.jpg',
};

const exercises = [
  { id: 1, name: 'Push-ups',         category: 'strength', description: 'Classic upper body exercise targeting chest, shoulders, and triceps.',                    defaultTime: 60, steps: ['Start in plank, hands slightly wider than shoulders.', 'Lower chest to floor.',        'Push back to start.', 'Keep core tight throughout.'] },
  { id: 2, name: 'Squats',           category: 'strength', description: 'Lower body exercise targeting quads, hamstrings, and glutes.',                             defaultTime: 60, steps: ['Stand feet shoulder-width apart.', 'Lower as if sitting in chair.',    'Keep knees over toes.', 'Return to standing.'] },
  { id: 3, name: 'Jumping Jacks',    category: 'cardio',   description: 'Full-body cardio that improves coordination and burns calories.',                           defaultTime: 45, steps: ['Stand with feet together.', 'Jump spreading legs & raising arms.',   'Return to start.', 'Repeat steadily.'] },
  { id: 4, name: 'Plank',            category: 'core',     description: 'Isometric core exercise that builds total midsection strength.',                            defaultTime: 30, steps: ['Rest on forearms in push-up position.', 'Keep body straight.',            'Engage core, hold.', 'Avoid hip sag.'] },
  { id: 5, name: 'Burpees',          category: 'cardio',   description: 'Full-body explosive movement combining strength and cardio.',                                defaultTime: 45, steps: ['Drop into squat.', 'Kick feet back, do push-up.',                 'Return to squat.', 'Jump explosively.'] },
  { id: 6, name: 'Lunges',           category: 'strength', description: 'Lower body exercise that improves balance and leg strength.',                               defaultTime: 60, steps: ['Stand tall.', 'Step forward and lower hips.',                        'Front knee above ankle.', 'Alternate legs.'] },
  { id: 7, name: 'Bicycle Crunches', category: 'core',     description: 'Dynamic core exercise targeting obliques and rectus abdominis.',                            defaultTime: 45, steps: ['Lie back, legs raised.', 'Bring elbow to opposite knee.',           'Switch sides.', 'Pedal continuously.'] },
  { id: 8, name: 'Mountain Climbers',category: 'cardio',   description: 'High-intensity exercise for core strength and endurance.',                                  defaultTime: 45, steps: ['Push-up position.', 'Drive knees to chest alternately.',           'Keep core engaged.', 'Maintain steady pace.'] },
  { id: 9, name: 'Glute Bridge',     category: 'strength', description: 'Targets glutes and hamstrings while protecting the lower back.',                           defaultTime: 45, steps: ['Lie back, knees bent.', 'Lift hips to form straight line.',          'Squeeze glutes at top.', 'Lower with control.'] },
  { id: 10, name: 'Russian Twists',  category: 'core',     description: 'Rotational core exercise that strengthens obliques and improves stability.',                defaultTime: 45, steps: ['Sit, knees bent, lean back.', 'Rotate torso side to side.',           'Core engaged throughout.', 'Lift feet for challenge.'] },
];

const CATEGORIES = [
  { value: 'all',      label: 'All',      color: 'from-gray-400 to-gray-500' },
  { value: 'strength', label: 'Strength', color: 'from-orange-400 to-rose-500' },
  { value: 'cardio',   label: 'Cardio',   color: 'from-red-400 to-pink-500' },
  { value: 'core',     label: 'Core',     color: 'from-blue-400 to-indigo-500' },
];

const CATEGORY_STYLE = {
  strength: { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' },
  cardio:   { bg: 'bg-red-100',    text: 'text-red-700',    bar: 'bg-red-500'    },
  core:     { bg: 'bg-blue-100',   text: 'text-blue-700',   bar: 'bg-blue-500'   },
};

const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function ExerciseCard({ exercise }) {
  const [expanded,    setExpanded]    = useState(false);
  const [customTime,  setCustomTime]  = useState(exercise.defaultTime);
  const [isSubmitting,setIsSubmitting]= useState(false);
  const [isActive,    setIsActive]    = useState(false);
  const [timeLeft,    setTimeLeft]    = useState(exercise.defaultTime);

  const progress = (timeLeft / customTime) * 100;
  const cs       = CATEGORY_STYLE[exercise.category];

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) { setIsActive(false); toast.success(`Time's up! Great job with ${exercise.name}! 🎉`); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [isActive, timeLeft, exercise.name]);

  const handleStart = async () => {
    if (isActive) { setIsActive(false); return; }
    setIsSubmitting(true);
    try {
      await api.post('/api/activity', {
        type:      exercise.name,
        duration:  customTime / 60,
        intensity: 'medium',
        calories:  Math.round((customTime / 60) * 100),
      });
      toast.success(`${exercise.name} started! 💪`);
      setTimeLeft(customTime);
      setIsActive(true);
    } catch {
      toast.error('Failed to log exercise.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={exerciseImages[exercise.name]}
          alt={exercise.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className={`h-full ${cs.bar} transition-all duration-1000`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Timer overlay */}
        {isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white text-4xl font-bold tabular-nums">{fmt(timeLeft)}</p>
              <p className="text-white/70 text-sm mt-1">remaining</p>
            </div>
          </div>
        )}
        {/* Category badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${cs.bg} ${cs.text}`}>
          {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-1">{exercise.name}</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">{exercise.description}</p>

        {/* Duration picker */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <Timer size={14} />Duration
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { const v = Math.max(15, customTime - 15); setCustomTime(v); setTimeLeft(v); }}
              disabled={isActive}
              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="text-sm font-bold text-gray-900 w-10 text-center">{fmt(customTime)}</span>
            <button
              onClick={() => { const v = customTime + 15; setCustomTime(v); if (!isActive) setTimeLeft(v); }}
              disabled={isActive}
              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => setExpanded(x => !x)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Hide' : 'How to'}
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleStart}
            disabled={isSubmitting}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-60 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-md hover:shadow-orange-200'
            }`}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : isActive ? (
              <><Square size={14} fill="white" />Stop</>
            ) : (
              <><Play size={14} fill="white" />Start</>
            )}
          </motion.button>
        </div>

        {/* Instructions */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-700 mb-2">How to perform:</p>
                <ol className="space-y-1.5">
                  {exercise.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-[10px]">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ExerciseList() {
  const [selected, setSelected] = useState('all');
  const filtered = selected === 'all' ? exercises : exercises.filter(e => e.category === selected);

  return (
    <div className="min-h-screen" style={{background:"var(--bg-page)"}}>
      <div className="page-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-2"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md shadow-purple-200">
              <Dumbbell size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
              <p className="text-sm text-gray-500">{exercises.length} exercises · tap Start to log & time</p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selected === value
                  ? `bg-gradient-to-r ${color} text-white shadow-sm`
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
              {value !== 'all' && (
                <span className={`ml-1.5 text-[11px] ${selected === value ? 'text-white/70' : 'text-gray-400'}`}>
                  ({exercises.filter(e => e.category === value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
