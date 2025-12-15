// import axiosInstance from './api.js';



// export const authService = {
//   register: (formData) => axiosInstance.post('/auth/register', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }),
//   login: (credentials) => axiosInstance.post('/auth/login', credentials),
//   getProfile: () => axiosInstance.get('/auth/profile'),
  
//   updateProfile: (formData) => axiosInstance.put('/auth/profile', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }),

//   changePassword: (data) => axiosInstance.put('/auth/change-password', data),
  
//   forgotPassword: (body) => axiosInstance.post('/auth/forgot-password', body),

//   resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  
//   logout: () => axiosInstance.post('/auth/logout'),

//   refreshToken: async () => {
//     try {
//       const response = await axiosInstance.post('/auth/refresh', null, { withCredentials: true });
//       // La réponse peut être directement les données ou dans response.data selon la configuration axios
//       return response?.data || response;
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       throw error;
//     }
//   },

//   activatedAccount: (token) => axiosInstance.get(`/auth/activate/${token}`),

//   resendActivation: async (email) => axiosInstance.post('/auth/resend-activation', { email }),
  
// };

// export default authService;
import axiosInstance from "./api";

export const authService = {
  register: (formData) =>
    axiosInstance.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  login: (credentials) => axiosInstance.post("/auth/login", credentials),

  getProfile: () => axiosInstance.get("/auth/profile"),

  updateProfile: (formData) =>
    axiosInstance.put("/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  changePassword: (data) => axiosInstance.put("/auth/change-password", data),

  forgotPassword: (body) => axiosInstance.post("/auth/forgot-password", body),

  resetPassword: (data) => axiosInstance.post("/auth/reset-password", data),

  logout: () => axiosInstance.post("/auth/logout"),

  // IMPORTANT: axiosInstance renvoie déjà response.data => refreshToken renvoie data DIRECT
  refreshToken: () => axiosInstance.post("/auth/refresh", null),

  activatedAccount: (token) => axiosInstance.get(`/auth/activate/${token}`),

  resendActivation: (email) => axiosInstance.post("/auth/resend-activation", { email }),
};

export default authService;
