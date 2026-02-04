import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://expense-tracker-3rg4.onrender.com/api'
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only auto-redirect on 401 for protected routes, not login/signup
        if (error.response?.status === 401) {
            const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                error.config?.url?.includes('/auth/signup');

            // Don't auto-logout if it's an auth endpoint (let component handle it)
            if (!isAuthEndpoint && localStorage.getItem('token')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Only redirect if we're not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
