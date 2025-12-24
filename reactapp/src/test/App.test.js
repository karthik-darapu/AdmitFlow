import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import themeReducer from '../redux/slices/themeSlice';

// Mock navigate function
const mockedNavigate = jest.fn();

// Create manual mocks
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../api/queries', () => ({
  authAPI: {
    loginUser: jest.fn(),
  },
}));

// Import after mocking
const Login = require('../components/Login').default;
const { authAPI } = require('../api/queries');

// Helper function to render component with all providers
const renderWithProviders = (component) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
    </Provider>
  );
};

describe('Login Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Test 1: Component renders correctly
  test('renders login form with all elements', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText(/Welcome back to/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in to continue to your dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  // Test 2: Email input field works correctly
  test('updates email input field on change', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  // Test 3: Password input field works correctly
  test('updates password input field on change', () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  // Test 5: Navigation after successful login
  test('navigates to dashboard after successful login', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    authAPI.loginUser.mockResolvedValue({ data: { user: mockUser } });

    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  // Test 7: Error display on failed login
  test('displays error message on failed login', async () => {
    const errorMessage = 'Invalid credentials';
    authAPI.loginUser.mockRejectedValue({ message: errorMessage });

    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  // Test 8: Register link is present
  test('renders link to register page', () => {
    renderWithProviders(<Login />);

    const registerLink = screen.getByRole('link', { name: /Create one/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  // Test 9: Email input is required
  test('email input has required attribute', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    expect(emailInput).toBeRequired();
  });

  // Test 10: Password input is required
  test('password input has required attribute', () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).toBeRequired();
  });

  // Test 11: Password input type is password
  test('password input has type password', () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test 12: Email input type is email
  test('email input has type email', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  // Test 13: Copyright text is displayed
  test('displays copyright text with current year', () => {
    renderWithProviders(<Login />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        new RegExp(`© ${currentYear} AdmitFlow. All rights reserved.`, 'i')
      )
    ).toBeInTheDocument();
  });

  // Test 14: User data is stored in Redux on successful login
  test('stores user data in Redux store on successful login', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    authAPI.loginUser.mockResolvedValue({ data: { user: mockUser } });

    const store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
      },
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Login />
        </QueryClientProvider>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.user).toEqual(mockUser);
    });
  });
});