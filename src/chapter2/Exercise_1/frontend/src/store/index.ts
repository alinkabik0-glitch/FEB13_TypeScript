// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import vacanciesReducer from './vacanciesSlice';
import { RootState } from '../types';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vacancies: vacanciesReducer,
  },
});

// Типизируем dispatch, чтобы он понимал Thunk и .unwrap()
export type AppDispatch = typeof store.dispatch;

// Создаем готовые типизированные хуки
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;