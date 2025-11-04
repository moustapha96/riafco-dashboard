import axiosInstance from './api.js';



export const authService = {
  register: (formData) => axiosInstance.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  getProfile: () => axiosInstance.get('/auth/profile'),
  
  updateProfile: (formData) => axiosInstance.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  changePassword: (data) => axiosInstance.put('/auth/change-password', data),
  
  forgotPassword: (body) => axiosInstance.post('/auth/forgot-password', body),

  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  
  logout: () => axiosInstance.post('/auth/logout'),

  refreshToken: () => axiosInstance.post('/auth/refresh', null, { withCredentials: true }),

  activatedAccount: (token) => axiosInstance.get(`/auth/activate/${token}`),

  resendActivation: async (email) => axiosInstance.post('/auth/resend-activation', { email }),
  
};

export default authService;