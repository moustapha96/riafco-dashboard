// import axios from "axios";
// import { toast } from "sonner";
// import Cookies from "js-cookie";
// import authService from "./authService";

// const urlApi = import.meta.env.VITE_API_URL;

// // Constantes pour les cookies
// const TOKEN_COOKIE = "riafo_token";
// const USER_COOKIE = "riafo_user";
// const COOKIE_EXPIRES = 7;

// const axiosInstance = axios.create({
//   baseURL: urlApi,
//   withCredentials: true, 
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
//   timeout: 10000, 
// });

// const publicRoutes = [
//   '/auth/login',
//   '/auth/register',
//   '/auth/forgot-password',
//   '/auth/reset-password',
//   '/auth/activate',
//   '/auth/refresh',
//   '/news',
//   '/partners',
// ];

// // Flag pour éviter les boucles infinies de refresh
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Vérifie si la route est publique
//     const isPublicRoute = publicRoutes.some((route) =>
//       config.url?.startsWith(route)
//     );
//     // Si ce n'est pas une route publique, ajoute le token
//     if (!isPublicRoute) {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response.data,
//   async (error) => {
//     const originalRequest = error.config;
//     const errorData = error.response?.data || {};
//     const errorCode = errorData.code || errorData.message;

//     // Vérifier si c'est une erreur d'authentification (401 ou codes spécifiques)
//     const isAuthError = error.response?.status === 401 || 
//                        errorCode === 'TOKEN_EXPIRED' || 
//                        errorCode === 'INVALID_TOKEN' || 
//                        errorCode === 'NO_TOKEN';

//     // Si l'erreur est d'authentification et que ce n'est pas une route publique
//     if (isAuthError && !publicRoutes.some(route => originalRequest.url?.startsWith(route))) {
//       // Si on n'est pas déjà en train de rafraîchir le token
//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           // Essayer de rafraîchir le token
//           const response = await authService.refreshToken();
          
//           if (response && response.token) {
//             // Sauvegarder le nouveau token dans localStorage
//             localStorage.setItem('token', response.token);
            
//             // Sauvegarder aussi dans les cookies
//             const isProduction = import.meta.env.MODE === "production";
//             Cookies.set(TOKEN_COOKIE, response.token, {
//               expires: COOKIE_EXPIRES,
//               sameSite: "strict",
//               secure: isProduction
//             });

//             // Si l'utilisateur est retourné, le sauvegarder aussi
//             if (response.user) {
//               const userString = JSON.stringify(response.user);
//               localStorage.setItem('user', userString);
//               Cookies.set(USER_COOKIE, userString, {
//                 expires: COOKIE_EXPIRES,
//                 sameSite: "strict",
//                 secure: isProduction
//               });
//             }
            
//             // Mettre à jour le header de la requête originale
//             originalRequest.headers.Authorization = `Bearer ${response.token}`;
            
//             // Traiter la queue des requêtes en attente
//             processQueue(null, response.token);
            
//             // Émettre un événement personnalisé pour notifier le AuthContext
//             window.dispatchEvent(new CustomEvent('tokenRefreshed', {
//               detail: { token: response.token, user: response.user }
//             }));
            
//             // Réessayer la requête originale
//             return axiosInstance(originalRequest);
//           } else {
//             // Pas de token, déconnexion
//             throw new Error('No token received');
//           }
//         } catch (refreshError) {
//           // Échec du refresh, déconnexion
//           processQueue(refreshError, null);
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           Cookies.remove(TOKEN_COOKIE);
//           Cookies.remove(USER_COOKIE);
          
//           // Émettre un événement pour notifier le AuthContext
//           window.dispatchEvent(new CustomEvent('tokenRefreshFailed'));
          
//           // Rediriger vers la page de login seulement si on n'y est pas déjà
//           if (window.location.pathname !== '/auth/login') {
//             window.location.href = '/auth/login';
//           }
          
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       } else {
//         // On est déjà en train de rafraîchir, mettre en queue
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(token => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return axiosInstance(originalRequest);
//           })
//           .catch(err => {
//             return Promise.reject(err);
//           });
//       }
//     } else if (error.response?.status === 403) {
//       window.location.href = '/auth/not-access';
//       toast.error(error.response?.data?.message || "Permission insuffisante");
//     }
    
//     return Promise.reject(error.response?.data || error.message);
//   }
// );

// export default axiosInstance;

import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import authService from "./authService";

const urlApi = import.meta.env.VITE_API_URL;

// Cookies keys
const TOKEN_COOKIE = "riafo_token";
const USER_COOKIE = "riafo_user";
const COOKIE_EXPIRES = 7;

const axiosInstance = axios.create({
  baseURL: urlApi,
  withCredentials: true, // IMPORTANT: pour envoyer le refresh cookie httpOnly
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

console.log(localStorage.getItem("token"));
// Routes publiques (pas besoin de Bearer)
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/activate",
  "/auth/resend-activation",
  "/auth/refresh", // IMPORTANT: on le considère public pour éviter les boucles
];

// Routes avec GET public mais autres méthodes privées
const routesWithPublicGet = ["/news", "/partners"];

// Helpers
const isPublicRoute = (url = "", method = "") => {
  // Vérifier les routes complètement publiques
  if (publicRoutes.some((route) => url.startsWith(route))) {
    return true;
  }
  
  // Pour les routes avec GET public, vérifier la méthode
  const hasPublicGet = routesWithPublicGet.some((route) => url.startsWith(route));
  if (hasPublicGet) {
    // GET est public, les autres méthodes (POST, PUT, DELETE, PATCH) nécessitent un token
    return method?.toUpperCase() === "GET";
  }
  
  return false;
};

// Évite boucle refresh + file d'attente
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (!isPublicRoute(config.url || "", config.method || "")) {
      const token = localStorage.getItem("token") || Cookies.get(TOKEN_COOKIE);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  // IMPORTANT: on retourne directement data
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const payload = error.response?.data || {};
    const code = payload.code || payload.error || payload.message;

    const authExpired =
      status === 401 ||
      code === "TOKEN_EXPIRED" ||
      code === "INVALID_TOKEN" ||
      code === "NO_TOKEN" ||
      code === "jwt expired" ||
      (typeof code === "string" && code.toLowerCase().includes("expired"));

    const originalUrl = originalRequest.url || "";
    const originalMethod = originalRequest.method || "";

    // Si 401 sur route publique => on laisse tomber
    if (authExpired && isPublicRoute(originalUrl, originalMethod)) {
      return Promise.reject(payload);
    }

    // REFRESH FLOW: uniquement si auth error et pas déjà retry
    if (authExpired && !originalRequest._retry) {
      // Si on est déjà en refresh: on met en queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // /auth/refresh doit lire le refreshToken httpOnly cookie côté serveur
        const refreshData = await authService.refreshToken(); // <-- refreshData est déjà data (pas .data)

        if (!refreshData?.token) throw new Error("No token received from refresh");

        const newToken = refreshData.token;
        localStorage.setItem("token", newToken);

        const isProd = import.meta.env.NODE_ENV === "production";
        Cookies.set(TOKEN_COOKIE, newToken, {
          expires: COOKIE_EXPIRES,
          sameSite: "strict",
          secure: isProd,
        });

        if (refreshData.user) {
          const userStr = JSON.stringify(refreshData.user);
          localStorage.setItem("user", userStr);
          Cookies.set(USER_COOKIE, userStr, {
            expires: COOKIE_EXPIRES,
            sameSite: "strict",
            secure: isProd,
          });
        }

        // Notifier l'app
        window.dispatchEvent(
          new CustomEvent("tokenRefreshed", {
            detail: { token: newToken, user: refreshData.user || null },
          })
        );

        processQueue(null, newToken);

        // Retry request original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Nettoyage + event
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Cookies.remove(TOKEN_COOKIE);
        Cookies.remove(USER_COOKIE);

        window.dispatchEvent(new CustomEvent("tokenRefreshFailed"));

        // Redirection login (si pas déjà)
        if (window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError?.response?.data || refreshError?.message || refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      toast.error(payload?.message || "Permission insuffisante");
      if (window.location.pathname !== "/auth/not-access") {
        window.location.href = "/auth/not-access";
      }
    }

    return Promise.reject(payload || error.message);
  }
);

export default axiosInstance;
