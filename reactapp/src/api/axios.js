import axios from 'axios';
import store from '../redux/store';
import { clearUser, setUser } from '../redux/slices/authSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Restore user session if stored in localStorage
const savedUser = localStorage.getItem('user');
if (savedUser) {
  store.dispatch(setUser(JSON.parse(savedUser)));
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear application auth state. Do NOT force a full-page redirect here;
      // allow client-side routing to respond to state changes. Forcing
      // window.location.href caused reload loops in some environments.
      store.dispatch(clearUser());
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;