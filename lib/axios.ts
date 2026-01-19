import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5223/api';
const API_TIMEOUT =
  parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10);

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Important for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axiosInstance.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const result = response.data;
          const authData = result.data || result;
          if (authData?.accessToken) {
            localStorage.setItem('access_token', authData.accessToken);
            if (authData.refreshToken) {
              localStorage.setItem('refresh_token', authData.refreshToken);
            }
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
            return axiosInstance(originalRequest);
          }
          
          throw new Error('Failed to refresh token');
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
