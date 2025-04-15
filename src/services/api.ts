
import axios from 'axios';

// Base axios instance with common configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    const errorMessage = error.response?.data?.message || 'Erro na requisição';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export default api;

// Common API service methods
export const apiService = {
  get: <T>(url: string, params?: object) => 
    api.get<T>(url, { params }).then(response => response.data),
  
  post: <T>(url: string, data: object) => 
    api.post<T>(url, data).then(response => response.data),
  
  put: <T>(url: string, data: object) => 
    api.put<T>(url, data).then(response => response.data),
  
  delete: <T>(url: string) => 
    api.delete<T>(url).then(response => response.data),
};
