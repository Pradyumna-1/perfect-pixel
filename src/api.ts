import axios, { type InternalAxiosRequestConfig } from 'axios';

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:10000/api'),
    timeout: 15000,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config as (InternalAxiosRequestConfig & { retryCount?: number }) | undefined;
        if (!config || config.method !== 'get') return Promise.reject(error);

        const retryCount = config.retryCount ?? 0;
        const status = error.response?.status;
        if (retryCount >= 2 || (status !== undefined && !RETRYABLE_STATUS.has(status))) {
            return Promise.reject(error);
        }

        config.retryCount = retryCount + 1;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
        return api(config);
    }
);

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
