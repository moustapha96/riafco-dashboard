const API_URL = import.meta.env.VITE_API_URL || '';

const getBackendBaseUrl = () => {
  if (!API_URL) return '';

  return API_URL;
};

/**
 * Construit l'URL complète d'une image à partir du backend + chemin renvoyé par l'API.
 * - Si `path` est déjà une URL absolue (http, https, //, data:), on la retourne telle quelle.
 * - En développement: utilise le proxy Vite (chemin relatif)
 * - En production: préfixe avec l'URL complète du backend
 */
export const buildImageUrl = (path) => {
  if (!path) return '';

  // Déjà absolu (CDN, autre domaine, data URL, etc.)
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) {
    return path;
  }

  // En développement, utiliser le proxy Vite (chemin relatif)
  // Le proxy redirigera automatiquement vers le backend
  const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
  
  if (isDevelopment) {
    // Normaliser le chemin pour commencer par /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return normalizedPath;
  }

  // En production, utiliser l'URL complète du backend
  const baseUrl = import.meta.env.VITE_API_URL_SIMPLE || 'https://back.riafco-oi.org';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

