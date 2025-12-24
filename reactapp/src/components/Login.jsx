import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/queries';
import { setUser } from '../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.loginUser,
    onSuccess: (response) => {
      dispatch(setUser(response.data.user));
      navigate('/dashboard');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                Welcome back to <span className="text-primary">AdmitFlow</span>
              </h1>
              <p className="text-base-content/60 mt-2">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Error Alert */}
            {loginMutation.isError && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{loginMutation.error?.message || 'An error occurred'}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full ${loginMutation.isPending ? 'loading' : ''}`}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-base-content/60">
                Don't have an account?{' '}
                <Link to="/register" className="link link-primary font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="text-center mt-8">
          <p className="text-base-content/40 text-sm">
            &copy; {new Date().getFullYear()} AdmitFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;