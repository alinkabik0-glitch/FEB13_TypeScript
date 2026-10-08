// src/store/vacanciesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../utils/api';
import { Vacancy, VacanciesState } from '../types';

const initialState: VacanciesState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

const getErrorMessage = (err: unknown): string => {
  const error = err as AxiosError<{ message: string }>;
  return error.response?.data?.message || 'Operation failed';
};

export const fetchVacancies = createAsyncThunk<Vacancy[]>(
  'vacancies/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Vacancy[]>('/vacancies');
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchVacancyById = createAsyncThunk<Vacancy, number>(
  'vacancies/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get<Vacancy>(`/vacancies/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const createVacancy = createAsyncThunk<void, Record<string, unknown>>(
  'vacancies/create',
  async (data, { rejectWithValue }) => {
    try {
      await api.post('/vacancies', data);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const updateVacancy = createAsyncThunk<
  { id: number; isActive: number },
  { id: number; isActive: boolean }
>('vacancies/update', async ({ id, isActive }, { rejectWithValue }) => {
  try {
    await api.put(`/vacancies/${id}`, { isActive });
    return { id, isActive: isActive ? 1 : 0 };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const respondToVacancy = createAsyncThunk<number, number>(
  'vacancies/respond',
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/vacancies/${id}/response`);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const cancelResponse = createAsyncThunk<number, number>(
  'vacancies/cancelResponse',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/vacancies/${id}/response`);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchMyVacancies = createAsyncThunk<Vacancy[]>(
  'vacancies/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Vacancy[]>('/my-vacancies');
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchActiveVacancies = createAsyncThunk<Vacancy[]>(
  'vacancies/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Vacancy[]>('/active-vacancies');
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchVacancyById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(updateVacancy.fulfilled, (state, action) => {
        const v = state.list.find((x) => x.id === action.payload.id);
        if (v) v.is_active = action.payload.isActive;
      })
      .addCase(respondToVacancy.fulfilled, (state, action) => {
        const v = state.list.find((x) => x.id === action.payload);
        if (v) {
          v.user_responded = 1;
          v.response_count = (v.response_count || 0) + 1;
        }
        if (state.current && state.current.id === action.payload) {
          state.current.user_responded = 1;
        }
      })
      .addCase(cancelResponse.fulfilled, (state, action) => {
        const v = state.list.find((x) => x.id === action.payload);
        if (v) {
          v.user_responded = 0;
          v.response_count = Math.max(0, (v.response_count || 1) - 1);
        }
        if (state.current && state.current.id === action.payload) {
          state.current.user_responded = 0;
        }
      })
      .addCase(fetchMyVacancies.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchActiveVacancies.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export const { clearCurrent } = vacanciesSlice.actions;
export default vacanciesSlice.reducer;