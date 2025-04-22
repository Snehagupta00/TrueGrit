import { NavLink } from 'react-router-dom';
import { Home, Activity, Utensils, Target, User, Dumbbell, Sun, Moon, Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Centralized theme object for consistent colors
const theme = {
  primary: '#4F46E5',
  secondary: '#FFFFFF',
  background: '#F9FAFB',
  darkBackground: '#111827',
  darkSurface: '#1F2937',
  lightSurface: '#FFFFFF',
  accent: '#6366F1',
  accentLight: '#EEF2FF',
  accentDark: '#4338CA',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  successLight: '#D1FAE5',
};

function Navbar({ toggleTheme }) {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/activity', label: 'Activity', icon: Activity },
    { to: '/nutrition', label: 'Nutrition', icon: Utensils },
    { to: '/exercise', label: 'Exercise', icon: Dumbbell },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Mobile Navbar (bottom) */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg text-gray-500 dark:text-gray-400 shadow-lg md:hidden py-3 px-4 flex justify-around items-center border-t border-gray-200 dark:border-gray-800 z-50 safe-bottom"
        style={{ borderColor: theme.border }}
      >
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative p-1 flex flex-col items-center transition-all duration-300 transform ${
                isActive
                  ? `text-[${theme.primary}] dark:text-[${theme.accent}] scale-110`
                  : `text-[${theme.textSecondary}] hover:text-[${theme.primary}] dark:hover:text-[${theme.accent}] hover:scale-105 active:scale-95`
              }`
            }
            end={to === '/'}
          >
            {({ isActive }) => (
              <>
                <Icon size={22} className={`transition-transform duration-300 ${isActive ? 'transform -translate-y-1' : ''}`} />
                <span className="text-xs mt-1 font-medium opacity-90">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -top-1 w-1 h-1 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </motion.nav>

      {/* Desktop Sidebar */}
      <motion.nav
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex fixed left-0 top-0 h-full bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 shadow-lg flex-col p-0 overflow-hidden border-r border-gray-200 dark:border-gray-800 z-40"
        style={{ borderColor: theme.border }}
      >
        {/* Toggle Button */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800" style={{ borderColor: theme.border }}>
          {isSidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold flex items-center"
              style={{ color: theme.primary }}
            >
              <Dumbbell className="mr-2" size={24} />
              TrueGrit<span style={{ color: theme.textSecondary }}>Pro</span>
            </motion.h1>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2 rounded-full"
            style={{ backgroundColor: theme.accentLight, color: theme.primary }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow overflow-y-auto py-4 custom-scrollbar">
          <div className="px-4 mb-6">
            {isSidebarOpen && (
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                Navigation
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1 px-3">
            {navLinks.map(({ to, label, icon: Icon }, index) => (
              <motion.div
                key={to}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="relative group"
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-lg flex items-center transition-all duration-300 relative ${
                      isActive
                        ? `bg-[${theme.accentLight}] text-[${theme.primary}] font-medium`
                        : `text-[${theme.textSecondary}] hover:bg-[${theme.accentLight}] hover:text-[${theme.primary}]`
                    }`
                  }
                  end={to === '/'}
                >
                  <Icon size={18} className={isSidebarOpen ? 'mr-3' : 'mx-auto'} />
                  {isSidebarOpen && <span>{label}</span>}
                  {to === '/activity' && isSidebarOpen && (
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: theme.accentLight, color: theme.primary }}
                    >
                      3
                    </span>
                  )}
                </NavLink>
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <div
                    className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: theme.darkSurface, color: theme.secondary }}
                  >
                    {label}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-800" style={{ borderColor: theme.border }}>
          <SignedIn>
            <div className={`p-4 flex ${isSidebarOpen ? 'items-center' : 'justify-center'}`}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10',
                      userButtonPopoverCard: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                    },
                  }}
                />
              </motion.div>
              {isSidebarOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium truncate" style={{ color: theme.textSecondary }}>
                    {user?.fullName || user?.username || 'User'}
                  </p>
                  <p className="text-xs truncate" style={{ color: theme.textSecondary }}>
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              )}
            </div>
          </SignedIn>
          <SignedOut>
            <div className={`p-4 ${isSidebarOpen ? '' : 'flex justify-center'}`}>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.secondary,
                    width: isSidebarOpen ? '100%' : 'auto',
                  }}
                >
                  {isSidebarOpen ? 'Sign in' : <User size={18} />}
                </motion.button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      </motion.nav>
    </>
  );
}

export default Navbar;
