// src/types/index.ts
export interface User {
  id: number;
  login: string;
  role: 'seeker' | 'employer';
  company_name?: string;
}

export interface Vacancy {
  id: number;
  title: string;
  short_description: string;
  description: string;
  user_responded: number;
  response_count: number;
  is_active: number;
  created_at: string;
  user_id: number;
  tags?: string;
  english_level?: string;
  grade?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface VacanciesState {
  list: Vacancy[];
  current: Vacancy | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  vacancies: VacanciesState;
}

// Добавленные типы для API
export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}