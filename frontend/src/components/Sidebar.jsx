import { NavLink } from 'react-router-dom';
import {
  Home, Activity, Utensils, Target, User, Dumbbell,
  Sun, Moon, TrendingUp, ChevronLeft, ChevronRight, Zap, BarChart2, History
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/',          label: 'Dashboard', icon: Home,     color: 'text-blue-600',    activeBg: 'bg-blue-50',    activeBar: 'bg-blue-500',    activeIcon: 'bg-blue-100',    description: 'Overview & Analytics' },
  { to: '/activity',  label: 'Workouts',  icon: Activity, color: 'text-orange-500',  activeBg: 'bg-orange-50',  activeBar: 'bg-orange-500',  activeIcon: 'bg-orange-100',  description: 'Track Activities' },
  { to: '/nutrition', label: 'Nutrition', icon: Utensils, color: 'text-emerald-500', activeBg: 'bg-emerald-50', activeBar: 'bg-emerald-500', activeIcon: 'bg-emerald-100', description: 'Meal Planning' },
  { to: '/exercise',  label: 'Exercises', icon: Dumbbell, color: 'text-purple-500',  activeBg: 'bg-purple-50',  activeBar: 'bg-purple-500',  activeIcon: 'bg-purple-100',  description: 'Exercise Library' },
  { to: '/goals',     label: 'Goals',     icon: Target,   color: 'text-red-500',     activeBg: 'bg-red-50',     activeBar: 'bg-red-500',     activeIcon: 'bg-red-100',     description: 'Track Progress' },
  { to: '/progress',  label: 'Progress',  icon: BarChart2, color: 'text-teal-500',   activeBg: 'bg-teal-50',    activeBar: 'bg-teal-500',    activeIcon: 'bg-teal-100',    description: 'Charts & Stats' },
  { to: '/history',   label: 'History',   icon: History,  color: 'text-violet-500',  activeBg: 'bg-violet-50',  activeBar: 'bg-violet-500',  activeIcon: 'bg-violet-100',  description: 'All Logs' },
  { to: '/profile',   label: 'Profile',   icon: User,     color: 'text-indigo-500',  activeBg: 'bg-indigo-50',  activeBar: 'bg-indigo-500',  activeIcon: 'bg-indigo-100',  description: 'Your Account' },
];

export default function Sidebar({ isOpen, onToggle, toggleTheme, theme }) {
  const { user } = useUser();

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex fixed left-0 top-0 h-full z-40 flex-col border-r overflow-hidden"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}
      style={{ minHeight: '100vh' }}
    >
      {/* ── Header ── */}
      <div
        className={`flex items-center border-b border-gray-100 px-3 py-4 ${
          isOpen ? 'justify-between' : 'justify-center'
        }`}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 min-w-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-md shadow-orange-200 shrink-0">
                <Zap size={17} className="text-white" fill="white" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-gray-900 tracking-tight leading-none">TrueGrit</p>
                <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-widest mt-0.5">Fitness Pro</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggle}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors shrink-0 ${isOpen ? 'ml-2' : ''}`}
        >
          {isOpen ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
        </button>
      </div>

      {/* ── Nav Links ── */}
      <nav className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        {/* Section label — only when open */}
        <AnimatePresence>
          {isOpen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 mb-2"
            >
              Main Menu
            </motion.p>
          )}
        </AnimatePresence>

        <div className={`space-y-0.5 ${isOpen ? 'px-3' : 'px-2'}`}>
          {navLinks.map(({ to, label, icon: Icon, color, activeBg, activeBar, activeIcon, description }) => (
            <div key={to} className="relative group">
              <NavLink to={to} end={to === '/'} className="block">
                {({ isActive }) => (
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                      isOpen
                        ? `gap-3 px-3 py-2.5 ${isActive ? `${activeBg} ${color}` : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`
                        : `justify-center py-2.5 ${isActive ? activeBg : 'hover:bg-gray-50'}`
                    }`}
                  >
                    {/* Active left bar — only when sidebar is open */}
                    {isActive && isOpen && (
                      <motion.div
                        layoutId="sidebar-bar"
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${activeBar}`}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Icon box */}
                    <div
                      className={`flex items-center justify-center rounded-xl shrink-0 transition-colors ${
                        isOpen ? 'w-8 h-8' : 'w-10 h-10'
                      } ${
                        isActive
                          ? activeIcon
                          : isOpen
                            ? 'bg-gray-100 group-hover:bg-gray-200'
                            : 'group-hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={isOpen ? 16 : 18} className={isActive ? color : 'text-gray-500 group-hover:text-gray-700'} />
                    </div>

                    {/* Label + description — only when open */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.12 }}
                          className="overflow-hidden min-w-0"
                        >
                          <p className={`text-sm font-semibold leading-tight whitespace-nowrap ${isActive ? color : ''}`}>
                            {label}
                          </p>
                          <p className="text-[11px] text-gray-400 whitespace-nowrap">{description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active dot — only when collapsed */}
                    {isActive && !isOpen && (
                      <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${activeBar}`} />
                    )}
                  </motion.div>
                )}
              </NavLink>

              {/* Tooltip — only when collapsed */}
              {!isOpen && (
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-800 rotate-45 -mr-1 shrink-0" />
                    <div className="bg-gray-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                      {label}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick action — only when open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 mt-4 pt-3 border-t border-gray-100 mx-3"
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quick Actions</p>
              <NavLink to="/activity">
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-semibold hover:shadow-md hover:shadow-orange-200 transition-all">
                  <TrendingUp size={15} />
                  Start Workout
                </button>
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── User Section ── */}
      <div className={`border-t border-gray-100 ${isOpen ? 'p-4' : 'py-4 flex flex-col items-center gap-3'}`}>
        <SignedIn>
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <UserButton appearance={{ elements: { avatarBox: 'w-9 h-9 ring-2 ring-orange-100' } }} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.fullName || user?.username || 'Athlete'}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-orange-50 hover:text-orange-500 text-gray-400 transition-colors shrink-0"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <UserButton appearance={{ elements: { avatarBox: 'w-9 h-9 ring-2 ring-orange-100' } }} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-orange-50 hover:text-orange-500 text-gray-400 transition-colors"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </>
          )}
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            {isOpen ? (
              <button className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-semibold hover:shadow-md transition-all">
                Sign In
              </button>
            ) : (
              <button
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white flex items-center justify-center hover:shadow-md transition-all"
                title="Sign In"
              >
                <User size={16} />
              </button>
            )}
          </SignInButton>
        </SignedOut>
      </div>
    </motion.aside>
  );
}
