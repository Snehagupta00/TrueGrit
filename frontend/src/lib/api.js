import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      toast.error('Cannot connect to server. Please try again later.');
      return Promise.reject(error);
    }

    const { response } = error;
    if (response) {
      switch (response.status) {
        case 401:
          toast.error('Session expired. Please sign in again.');
          setTimeout(() => {
            window.location.href = '/sign-in';
          }, 1500);
          break;
        case 403:
          toast.error('You don\'t have permission for this action.');
          break;
        case 400:
          toast.error(response.data.message || 'Invalid request.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(response.data.message || 'Something went wrong.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;