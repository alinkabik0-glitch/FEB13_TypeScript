import axios, { AxiosRequestConfig } from 'axios';
import { LoginResponse, ApiResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Типизированные методы API
export const authAPI = {
  login: (login: string, password: string) => 
    api.post<ApiResponse<LoginResponse>>('/auth/login', { login, password }),
  
  register: (data: Record<string, string>) => 
    api.post<ApiResponse<LoginResponse>>('/auth/register', data),
};

export const vacanciesAPI = {
  getAll: () => api.get<ApiResponse<any[]>>('/vacancies'),
  getById: (id: number) => api.get<ApiResponse<any>>(`/vacancies/${id}`),
  create: (data: Record<string, any>) => api.post<ApiResponse<any>>('/vacancies', data),
  respond: (id: number) => api.post<ApiResponse<any>>(`/vacancies/${id}/respond`),
};

export default api;