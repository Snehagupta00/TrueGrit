import { NavLink } from 'react-router-dom';
import { Home, Activity, Utensils, Target, User, Dumbbell, Sun, Moon } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ toggleTheme, theme }) {
  const { user } = useUser();
  const primaryColor = 'indigo'; 

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/activity', label: 'Activity', icon: Activity },
    { to: '/nutrition', label: 'Nutrition', icon: Utensils },
    { to: '/exercise', label: 'Exercise', icon: Dumbbell },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const colorClasses = {
    indigo: {
      active: 'text-indigo-600 dark:text-indigo-400',
      hover: 'hover:text-indigo-600 dark:hover:text-indigo-300',
      bgActive: 'bg-indigo-100 dark:bg-indigo-800/50',
      bgHover: 'hover:bg-indigo-100/50 dark:hover:bg-indigo-800/30',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      text: 'text-indigo-400 dark:text-indigo-500'
    }
  };

  const currentColor = colorClasses[primaryColor];

  return (
    <>
      {/* Mobile Navbar (bottom) */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg text-gray-500 dark:text-gray-400 
          shadow-lg md:hidden py-3 px-4 flex justify-around items-center border-t border-gray-200 dark:border-gray-800 z-50
          safe-bottom`}
      >
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative p-1 flex flex-col items-center transition-all duration-300 transform ${
                isActive
                  ? `${currentColor.active} scale-110`
                  : `text-gray-500/70 dark:text-gray-400/70 ${currentColor.hover} hover:scale-105 active:scale-95`
              }`
            }
            end={to === '/'}
          >
            {({ isActive }) => (
              <>
                <Icon 
                  size={22} 
                  className={`transition-transform duration-300 ${isActive ? 'transform -translate-y-1' : ''}`} 
                />
                <span className="text-xs mt-1 font-medium opacity-90">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute -top-1 w-1 h-1 rounded-full ${currentColor.active.replace('text', 'bg')}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </motion.nav>

      {/* Desktop Navbar (side) */}
      <motion.nav
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`hidden md:flex fixed left-0 top-0 h-full bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 shadow-lg flex-col w-64 p-0 overflow-hidden border-r border-gray-200 dark:border-gray-800 z-40`}
      >
        {/* Logo/Brand */}
        <div className={`p-6 border-b border-gray-200 dark:border-gray-800`}>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`text-2xl font-bold ${currentColor.active} flex items-center`}
          >
            <Dumbbell className="mr-2" size={24} />
            TrueGrit<span className="text-gray-400 dark:text-gray-500">Pro</span>
          </motion.h1>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow overflow-y-auto py-4 custom-scrollbar">
          <div className="px-6 mb-6">
            <span className={`text-xs font-semibold ${currentColor.text} uppercase tracking-wider`}>
              Navigation
            </span>
          </div>
          <div className="flex flex-col space-y-1 px-3">
            {navLinks.map(({ to, label, icon: Icon }, index) => (
              <motion.div
                key={to}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-lg flex items-center transition-all duration-300 ${
                      isActive
                        ? `${currentColor.bgActive} ${currentColor.active} font-medium`
                        : `text-gray-600/80 dark:text-gray-300/80 ${currentColor.bgHover}`
                    }`
                  }
                  end={to === '/'}
                >
                  <Icon size={18} className="mr-3" />
                  <span>{label}</span>
                  {to === '/activity' && (
                    <span className="ml-auto bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className={`mt-auto border-t border-gray-200 dark:border-gray-800`}>
          <SignedIn>
            <div className="p-4 flex items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <UserButton appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  }
                }} />
              </motion.div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {user?.fullName || user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="p-4">
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full ${currentColor.button} text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm`}
                >
                  Sign in
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