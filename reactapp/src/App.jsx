import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { authAPI } from './api/queries';
import { setUser, clearUser } from './redux/slices/authSlice';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Programs from './components/Programs';
import Dashboard from './components/Dashboard';
import Applications from './components/Applications';
import ApplicationDetail from './components/ApplicationDetail';
import Apply from './components/Apply';
import Profile from './components/Profile';
import CreateProgram from './components/CreateProgram';
import ProgramDetail from './components/ProgramDetail';

// QueryClient is provided at index.js level

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.theme.theme);

  // Check authentication status on mount
  useQuery({
    queryKey: ['currentUser'],
    queryFn: authAPI.getCurrentUser,
    retry: false,
    enabled: !user,
    onSuccess: (response) => {
      dispatch(setUser(response.data.user));
    },
    onError: () => {
      dispatch(clearUser());
    }
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          {/* Debug banner to verify app mount and state (remove when fixed) */}
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-3 py-1 rounded shadow">
            Theme: {theme} {user ? `| User: ${user.name}` : '| Not logged in'}
          </div>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<ProgramDetail />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <Applications />
                  </PrivateRoute>
                }
              />
              <Route
                path="/applications/:id"
                element={
                  <PrivateRoute>
                    <ApplicationDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/apply/:programId"
                element={
                  <PrivateRoute allowedRoles={['student']}>
                    <Apply />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/programs/create"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <CreateProgram />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
  );
}

export default App;