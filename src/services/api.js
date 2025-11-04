import axios from "axios";
import { toast } from "sonner";
const urlApi = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: urlApi,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, 
});

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/activate',
  '/news',
  '/partners',
];

axiosInstance.interceptors.request.use(
  (config) => {
    // Vérifie si la route est publique
    const isPublicRoute = publicRoutes.some((route) =>
      config.url?.startsWith(route)
    );
    // Si ce n'est pas une route publique, ajoute le token
    if (!isPublicRoute) {
      const token = localStorage.getItem('token');
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

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
  
    if (error.response?.status === 401) {
      const isPublicRoute = publicRoutes.some((route) =>
        error.config.url?.startsWith(route)
      );

      if (!isPublicRoute) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    } else if (error.response?.status === 403) {
         window.location.href = '/auth/not-access';
         toast.error(error.response?.data?.message || "Permission isuffisante");
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;
