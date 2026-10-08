// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../utils/api';
import { User, AuthState } from '../types';

const getUserFromStorage = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? (JSON.parse(user) as User) : null;
};

const getErrorMessage = (err: unknown): string => {
  const error = err as AxiosError<{ message: string }>;
  return error.response?.data?.message || 'Operation failed';
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { user: User; token: string },
  { login: string; password: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post<{ user: User; token: string }>('/login', credentials);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const signup = createAsyncThunk<
  { user: User; token: string },
  unknown // ИСПРАВЛЕНО: было Record<string, string>
>('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post<{ user: User; token: string }>('/signup', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const companySignup = createAsyncThunk<
  { user: User; token: string },
  unknown // ИСПРАВЛЕНО: было Record<string, string>
>('auth/companySignup', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post<{ user: User; token: string }>('/company-signup', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(companySignup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;