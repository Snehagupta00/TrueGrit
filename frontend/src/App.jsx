import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/NavBar';
import { setAuthToken } from './lib/api';

// Lazy-loaded components
const Dashboard = lazy(() => import('./components/Dashboard'));
const ActivityLog = lazy(() => import('./components/ActivityLog'));
const NutritionLog = lazy(() => import('./components/NutritionLog'));
const Goals = lazy(() => import('./components/Goals'));
const Profile = lazy(() => import('./components/Profile'));
const ExcerciseList = lazy(() => import('./components/ExcerciseList'));

function App() {
  const { isLoaded, userId, isSignedIn, getToken } = useAuth();
  const [theme, setTheme] = useState('light');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Set the auth token when the user signs in
  useEffect(() => {
    const setupAuthToken = async () => {
      if (isSignedIn && isLoaded) {
        try {
          const token = await getToken();
          if (token) {
            setAuthToken(token);
            setIsTokenSet(true);
          } else {
            console.error('No token received from Clerk');
            navigate('/sign-in');
          }
        } catch (error) {
          console.error('Error setting auth token:', error);
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
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    );
  }

  const isAuthenticated = isSignedIn && userId && isTokenSet;

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/sign-in" />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {isAuthenticated ? (
        <div className="pb-16 md:pb-0 md:ml-64">
          <Navbar toggleTheme={toggleTheme} theme={theme} />
          <div className="pt-2 px-4 max-w-6xl mx-auto">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
                </div>
              }
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activity"
                  element={
                    <ProtectedRoute>
                      <ActivityLog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutrition"
                  element={
                    <ProtectedRoute>
                      <NutritionLog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/goals"
                  element={
                    <ProtectedRoute>
                      <Goals />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exercise"
                  element={
                    <ProtectedRoute>
                      <ExcerciseList />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
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
      <Toaster position="top-right" />
    </div>
  );
}

export default App;