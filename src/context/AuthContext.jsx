// /* eslint-disable react/prop-types */

// "use client"

// import { createContext, useState, useEffect,  useCallback } from "react"
// import { useNavigate } from "react-router-dom"
// import Cookies from "js-cookie"
// import authService from "../services/authService"

// // Contexte par défaut
// export const AuthContext = createContext(undefined)


// // Nom des cookies
// const USER_COOKIE = "riafo_user"
// const TOKEN_COOKIE = "riafo_token"

// // Durée des cookies (7 jours pour "remember me")
// const COOKIE_EXPIRES = 7

// export const AuthProvider  = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [token, setToken] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   // Fonction pour récupérer le profil à jour
//   const fetchProfile = useCallback(async () => {
//     try {
//       if (!token) return
//       const response = await authService.getProfile()
//       const updatedUser = { ...response.data?.user || response.user }
//       setUser(updatedUser)
//       const isProduction = import.meta.env.MODE === "production";
//       Cookies.set(USER_COOKIE, JSON.stringify(updatedUser),
//         { expires: COOKIE_EXPIRES, sameSite: "strict", secure: isProduction })
      
//     } catch (error) {
//       console.error("Erreur lors de la récupération du profil:", error)
//       // Si erreur 401, essayer de rafraîchir le token
//       if (error?.code === "INVALID_TOKEN" || error?.code === "NO_TOKEN") {
//         try {
//           const refreshResponse = await authService.refreshToken()
//           if (refreshResponse?.token) {
//             setToken(refreshResponse.token)
//             localStorage.setItem('token', refreshResponse.token)
//             Cookies.set(TOKEN_COOKIE, refreshResponse.token, 
//               { expires: COOKIE_EXPIRES, sameSite: "strict", secure: import.meta.env.MODE === "production" })
//             // Réessayer de récupérer le profil
//             const retryResponse = await authService.getProfile()
//             const updatedUser = { ...retryResponse.data?.user || retryResponse.user }
//             setUser(updatedUser)
//             Cookies.set(USER_COOKIE, JSON.stringify(updatedUser),
//               { expires: COOKIE_EXPIRES, sameSite: "strict", secure: import.meta.env.MODE === "production" })
//           }
//         } catch (refreshError) {
//           console.error("Erreur lors du refresh token:", refreshError)
//           // Si le refresh échoue, déconnexion
//           logout()
//         }
//       }
//     }
//   }, [token])

//   useEffect(() => {
//     const loadAuthData = async () => {
//       try {
//         // Vérifier d'abord localStorage (priorité)
//         const tokenFromStorage = localStorage.getItem('token')
//         const userFromStorage = localStorage.getItem('user')
        
//         // Sinon vérifier les cookies
//         const tokenCookie = Cookies.get(TOKEN_COOKIE) || tokenFromStorage
//         const userCookie = Cookies.get(USER_COOKIE) || userFromStorage

//         if (tokenCookie) {
//           // Synchroniser le token dans localStorage et cookies
//           localStorage.setItem('token', tokenCookie)
//           const isProduction = import.meta.env.MODE === "production";
//           Cookies.set(TOKEN_COOKIE, tokenCookie, 
//             { expires: COOKIE_EXPIRES, sameSite: "strict", secure: isProduction })
          
//           setToken(tokenCookie)

//           if (userCookie) {
//             try {
//               const parsedUser = JSON.parse(userCookie)
//               setUser(parsedUser)
//               // Synchroniser dans localStorage aussi
//               localStorage.setItem('user', userCookie)
//             } catch (parseError) {
//               console.error("Erreur parsing user cookie:", parseError)
//             }
//           }

//           // Essayer de rafraîchir le token au chargement pour vérifier qu'il est valide
//           try {
//             const refreshResponse = await authService.refreshToken()
//             if (refreshResponse?.token) {
//               setToken(refreshResponse.token)
//               localStorage.setItem('token', refreshResponse.token)
//               Cookies.set(TOKEN_COOKIE, refreshResponse.token, 
//                 { expires: COOKIE_EXPIRES, sameSite: "strict", secure: import.meta.env.MODE === "production" })
              
//               if (refreshResponse.user) {
//                 setUser(refreshResponse.user)
//                 const userString = JSON.stringify(refreshResponse.user)
//                 Cookies.set(USER_COOKIE, userString, 
//                   { expires: COOKIE_EXPIRES, sameSite: "strict", secure: import.meta.env.MODE === "production" })
//                 localStorage.setItem('user', userString)
//               }
//             }
//           } catch (refreshError) {
//             console.error("Token invalide au chargement, déconnexion:", refreshError)
//             // Token invalide, nettoyer
//             Cookies.remove(USER_COOKIE)
//             Cookies.remove(TOKEN_COOKIE)
//             localStorage.removeItem("token")
//             localStorage.removeItem("user")
//             setUser(null)
//             setToken(null)
//           }
//         }
//       } catch (error) {
//         console.error("Erreur lors du chargement des données d'authentification:", error)
//         Cookies.remove(USER_COOKIE)
//         Cookies.remove(TOKEN_COOKIE)
//         localStorage.removeItem("token")
//         localStorage.removeItem("user")
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadAuthData()
//   }, [])

//   // useEffect(() => {
//   //   if (token) {
//   //     fetchProfile()
//   //   }
//   // }, [token, fetchProfile])

//   // Sauvegarder le token et l'utilisateur dans les cookies et localStorage
//   const saveAuthData = useCallback((userData, rememberMe = false) => {
//     setUser(userData)
//     setToken(userData.token)
//     const isProduction = import.meta.env.MODE === "production";
//     const cookieOptions = rememberMe
//       ? { expires: COOKIE_EXPIRES, sameSite: "strict", secure: isProduction }
//       : { sameSite: "strict", secure: isProduction };

//     // Sauvegarder dans les cookies
//     Cookies.set(USER_COOKIE, JSON.stringify(userData), cookieOptions)
//     Cookies.set(TOKEN_COOKIE, userData.token, cookieOptions)
    
//     // Sauvegarder aussi dans localStorage pour synchronisation
//     localStorage.setItem('token', userData.token)
//     localStorage.setItem('user', JSON.stringify(userData))
//   }, [])

//   // Fonction de login
//   const login = useCallback(
//     async (userData, rememberMe = false) => {
//       saveAuthData(userData, rememberMe)
//       await fetchProfile()
//       navigate("/")
//     },
//     [navigate, saveAuthData, fetchProfile],
//   )

//   const logout = useCallback(async () => {
//     try {
//       // Appeler l'API de déconnexion si on a un token
//       if (token) {
//         try {
//           await authService.logout()
//         } catch (error) {
//           console.error("Erreur lors de l'appel logout API:", error)
//           // Continuer même si l'API échoue
//         }
//       }

//       // Clear state
//       setUser(null)
//       setToken(null)

//       // Clear cookies
//       Cookies.remove(USER_COOKIE)
//       Cookies.remove(TOKEN_COOKIE)

//       // Clear localStorage
//       localStorage.removeItem("token")
//       localStorage.removeItem("user")
      
//       navigate("/auth/login")
//     } catch (error) {
//       console.error("Erreur lors de la déconnexion:", error)
//       // Nettoyer quand même
//       setUser(null)
//       setToken(null)
//       Cookies.remove(USER_COOKIE)
//       Cookies.remove(TOKEN_COOKIE)
//       localStorage.removeItem("token")
//       localStorage.removeItem("user")
//       navigate("/auth/login")
//     }
//   }, [navigate, token])

//   const isAuthenticated = !!token && !!user

//   // Rendre le contexte
//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         login,
//         logout,
//         isAuthenticated,
//         loading,
//         fetchProfile,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

/* eslint-disable react/prop-types */
"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import authService from "../services/authService";

export const AuthContext = createContext(undefined);

const USER_COOKIE = "riafo_user";
const TOKEN_COOKIE = "riafo_token";
const COOKIE_EXPIRES = 7;

const cookieOpts = () => {
  const isProd = import.meta.env.NODE_ENV === "production";
  return { expires: COOKIE_EXPIRES, sameSite: "strict", secure: isProd };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const persistAuth = useCallback((nextUser, nextToken, rememberMe = false) => {
    const isProd = import.meta.env.MODE === "production";
    const opts = rememberMe ? { expires: COOKIE_EXPIRES, sameSite: "strict", secure: isProd } : { sameSite: "strict", secure: isProd };

    if (nextToken) {
      setToken(nextToken);
      localStorage.setItem("token", nextToken);
      Cookies.set(TOKEN_COOKIE, nextToken, opts);
    }

    if (nextUser) {
      setUser(nextUser);
      const s = JSON.stringify(nextUser);
      localStorage.setItem("user", s);
      Cookies.set(USER_COOKIE, s, opts);
    }
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove(TOKEN_COOKIE);
    Cookies.remove(USER_COOKIE);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      // selon ton backend: profile.user ou profile.data.user etc.
      const updatedUser = profile?.data?.user || profile?.user || profile;
      if (updatedUser) {
        setUser(updatedUser);
        Cookies.set(USER_COOKIE, JSON.stringify(updatedUser), cookieOpts());
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return updatedUser;
    } catch (e) {
      // Ne force pas logout ici: l'interceptor va gérer refresh + event
      throw e;
    }
  }, []);

  const login = useCallback(
    async (loginResponse, rememberMe = false) => {
      // loginResponse doit contenir token + user (ou au moins token)
      const nextToken = loginResponse?.token || loginResponse?.data?.token || loginResponse?.accessToken;
      const nextUser = loginResponse?.user || loginResponse?.data?.user || null;

      if (!nextToken) throw new Error("Token manquant dans la réponse de login");

      persistAuth(nextUser || { ...(loginResponse || {}), token: undefined }, nextToken, rememberMe);

      // optionnel: récupérer profil complet
      try {
        await fetchProfile();
      } catch (_) {
        // pas bloquant
      }

      navigate("/");
    },
    [fetchProfile, navigate, persistAuth]
  );

  const logout = useCallback(async () => {
    try {
      try {
        await authService.logout();
      } catch (_) {
        // on ignore si l’API échoue
      }
    } finally {
      clearAuth();
      navigate("/auth/login");
    }
  }, [clearAuth, navigate]);

  // Init (reprise session)
  useEffect(() => {
    const init = async () => {
      try {
        const tokenLS = localStorage.getItem("token");
        const userLS = localStorage.getItem("user");

        const tokenCookie = Cookies.get(TOKEN_COOKIE);
        const userCookie = Cookies.get(USER_COOKIE);

        const initialToken = tokenLS || tokenCookie || null;
        const initialUserStr = userLS || userCookie || null;

        if (initialToken) {
          setToken(initialToken);
          localStorage.setItem("token", initialToken);
          Cookies.set(TOKEN_COOKIE, initialToken, cookieOpts());
        }

        if (initialUserStr) {
          try {
            setUser(JSON.parse(initialUserStr));
            localStorage.setItem("user", initialUserStr);
            Cookies.set(USER_COOKIE, initialUserStr, cookieOpts());
          } catch (_) {
            // ignore
          }
        }

        // Tenter un refresh au démarrage (si refresh cookie existe, ça marche)
        // Si ça échoue, on garde quand même la session locale (interceptor gérera au 1er 401)
        try {
          const r = await authService.refreshToken();
          if (r?.token) {
            persistAuth(r.user || user, r.token, true);
          }
        } catch (_) {
          // ignore
        }
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IMPORTANT: écouter les events envoyés par axios interceptor
  useEffect(() => {
    const onRefreshed = (e) => {
      const newToken = e.detail?.token;
      const newUser = e.detail?.user;
      if (newToken) setToken(newToken);
      if (newUser) setUser(newUser);
    };

    const onRefreshFailed = () => {
      clearAuth();
    };

    window.addEventListener("tokenRefreshed", onRefreshed);
    window.addEventListener("tokenRefreshFailed", onRefreshFailed);

    return () => {
      window.removeEventListener("tokenRefreshed", onRefreshed);
      window.removeEventListener("tokenRefreshFailed", onRefreshFailed);
    };
  }, [clearAuth]);

  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        fetchProfile,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
