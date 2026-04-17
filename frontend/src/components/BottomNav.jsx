import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Activity, Utensils, Target, BarChart2,
  MoreHorizontal, Dumbbell, User, History, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/',          label: 'Home',      icon: Home,     color: 'text-blue-600',    activeBg: 'bg-blue-500'    },
  { to: '/activity',  label: 'Workout',   icon: Activity, color: 'text-orange-500',  activeBg: 'bg-orange-500'  },
  { to: '/nutrition', label: 'Nutrition', icon: Utensils, color: 'text-emerald-500', activeBg: 'bg-emerald-500' },
  { to: '/progress',  label: 'Progress',  icon: BarChart2,color: 'text-teal-500',    activeBg: 'bg-teal-500'    },
];

const moreLinks = [
  { to: '/goals',    label: 'Goals',    icon: Target,   color: 'text-red-500',     bg: 'bg-red-50',    iconBg: 'bg-red-100'    },
  { to: '/exercise', label: 'Exercise', icon: Dumbbell, color: 'text-purple-500',  bg: 'bg-purple-50', iconBg: 'bg-purple-100' },
  { to: '/history',  label: 'History',  icon: History,  color: 'text-violet-500',  bg: 'bg-violet-50', iconBg: 'bg-violet-100' },
  { to: '/profile',  label: 'Profile',  icon: User,     color: 'text-indigo-500',  bg: 'bg-indigo-50', iconBg: 'bg-indigo-100' },
];

export default function BottomNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleMore = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Slide-up panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="lg:hidden fixed bottom-16 left-0 right-0 z-50 mx-3 mb-2 rounded-2xl border shadow-2xl overflow-hidden"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <p className="text-sm font-bold text-gray-700">More Pages</p>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Grid of links */}
            <div className="grid grid-cols-4 gap-2 p-4">
              {moreLinks.map(({ to, label, icon: Icon, color, bg, iconBg }) => (
                <motion.button
                  key={to}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handleMore(to)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl ${bg} transition-colors`}
                >
                  <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon size={18} className={color} />
                  </div>
                  <span className={`text-[10px] font-bold ${color}`}>{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 lg:hidden z-50 border-t shadow-lg"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      >
        <div className="flex justify-around items-center px-2 py-2">
          {navLinks.map(({ to, label, icon: Icon, color, activeBg }) => (
            <NavLink key={to} to={to} end={to === '/'} className="flex-1">
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 py-1"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? `${activeBg} shadow-sm` : 'bg-transparent'
                  }`}>
                    <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
                    isActive ? color : 'text-gray-400'
                  }`}>
                    {label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}

          {/* More button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(v => !v)}
            className="flex-1 flex flex-col items-center gap-1 py-1"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              open ? 'bg-gray-700 shadow-sm' : 'bg-transparent'
            }`}>
              {open
                ? <X size={20} className="text-white" />
                : <MoreHorizontal size={20} className="text-gray-400" />
              }
            </div>
            <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
              open ? 'text-gray-700' : 'text-gray-400'
            }`}>
              More
            </span>
          </motion.button>
        </div>
      </nav>
    </>
  );
}
