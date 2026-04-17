import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Navbar from './components/NavBar';
import { setAuthToken } from './lib/api';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ActivityLog = lazy(() => import('./components/ActivityLog'));
const NutritionLog = lazy(() => import('./components/NutritionLog'));
const Goals = lazy(() => import('./components/Goals'));
const Profile = lazy(() => import('./components/Profile'));
const ExcerciseList = lazy(() => import('./components/ExcerciseList'));
const Progress = lazy(() => import('./components/Progress'));
const History  = lazy(() => import('./components/History'));

function App() {
  const { isLoaded, userId, isSignedIn, getToken } = useAuth();
  const [theme, setTheme] = useState('light');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    const setupAuthToken = async () => {
      if (isSignedIn && isLoaded) {
        try {
          const token = await getToken();
          if (token) {
            setAuthToken(token);
            setIsTokenSet(true);
          } else {
            navigate('/sign-in');
          }
        } catch {
          navigate('/sign-in');
        }
      } else {
        setIsTokenSet(false);
      }
    };
    setupAuthToken();
  }, [isSignedIn, isLoaded, getToken, navigate]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  const isAuthenticated = isSignedIn && userId && isTokenSet;
  const ProtectedRoute = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/sign-in" replace />;

  const sidebarWidth = isDesktop ? (sidebarOpen ? 260 : 72) : 0;

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {isAuthenticated ? (
        <>
          <Navbar
            toggleTheme={toggleTheme}
            theme={theme}
            onSidebarChange={setSidebarOpen}
          />

          <motion.main
            animate={{ marginLeft: sidebarWidth }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="min-h-screen pt-14 lg:pt-0 pb-20 lg:pb-0"
            style={{ marginLeft: sidebarWidth }}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/activity" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
                <Route path="/nutrition" element={<ProtectedRoute><NutritionLog /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/exercise" element={<ProtectedRoute><ExcerciseList /></ProtectedRoute>} />
                <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                <Route path="/history"  element={<ProtectedRoute><History  /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </motion.main>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-orange-50 via-white to-rose-50">
          <div className="w-full max-w-md">
            <Routes>
              <Route
                path="/sign-in/*"
                element={<SignIn routing="path" path="/sign-in" afterSignInUrl="/" afterSignUpUrl="/" />}
              />
              <Route
                path="/sign-up/*"
                element={<SignUp routing="path" path="/sign-up" afterSignInUrl="/" afterSignUpUrl="/" />}
              />
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
          </div>
        </div>
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#1a2332',
            border: '1px solid #f3f4f6',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        }}
      />
    </div>
  );
}

export default App;
