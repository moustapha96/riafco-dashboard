const API_URL = import.meta.env.VITE_API_URL || '';

const getBackendBaseUrl = () => {
  if (!API_URL) return '';

  return API_URL;
};

/**
 * Construit l'URL complète d'une image à partir du backend + chemin renvoyé par l'API.
 * - Si `path` est déjà une URL absolue (http, https, //, data:), on la retourne telle quelle.
 * - Sinon on préfixe avec l'URL du backend.
 */
export const buildImageUrl = (path) => {
  if (!path) return '';

  // Déjà absolu (CDN, autre domaine, data URL, etc.)
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) {
    return path;
  }

  const base = getBackendBaseUrl();
  if (!base) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

