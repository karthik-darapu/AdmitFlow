import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const savedUser = localStorage.getItem('user');
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false,
    error: null
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      // Clear from localStorage
      localStorage.removeItem('user');
    }
  }
});

export const { setUser, setLoading, setError, clearUser } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;