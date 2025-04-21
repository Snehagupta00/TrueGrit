import { NavLink } from 'react-router-dom';
import { Home, Activity, Utensils, Target, User, Dumbbell, Sun, Moon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

function Navbar({ toggleTheme, theme }) {
  const { user } = useUser();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/activity', label: 'Activity', icon: Activity },
    { to: '/nutrition', label: 'Nutrition', icon: Utensils },
    { to: '/exercise', label: 'Exercise', icon: Dumbbell },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Navbar (bottom) */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg md:hidden p-2 flex justify-around border-t z-10"
      >
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `p-2 flex flex-col items-center transition-colors duration-300 ${
                isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-300'
              }`
            }
            end={to === '/'}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </motion.nav>

      {/* Desktop Navbar (side) */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-md flex-col w-64 p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary dark:text-primary-light">FitTrack</h1>
        </div>
        <div className="flex-grow overflow-y-auto py-4">
          <div className="px-3 mb-6">
            <span className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Main Menu
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `mx-3 px-3 py-2.5 rounded-lg flex items-center transition-all duration-300 ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:text-primary-light font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`
                }
                end={to === '/'}
              >
                <Icon size={18} className="mr-3" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <SignedIn>
          <div className="mt-auto border-t border-gray-100 dark:border-gray-700">
            <div className="p-4 flex items-center">
              <UserButton />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {user?.fullName || user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="mt-auto border-t border-gray-100 dark:border-gray-700 p-4">
            <SignInButton mode="modal">
              <button className="w-full bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                Sign in
              </button>
            </SignInButton>
          </div>
        </SignedOut>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="ml-2">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;