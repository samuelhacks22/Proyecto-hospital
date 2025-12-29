import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export const appointmentService = {
    getAll: () => api.get('/appointments'),
    create: (data) => api.post('/appointments', data),
};

export const doctorService = {
    getAll: () => api.get('/doctors'),
    getAvailability: (doctorId) => api.get(`/doctors/${doctorId}/availability`),
};

export const userService = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

export default api;

