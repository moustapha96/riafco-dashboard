//

import axiosInstance from "./api"

const themeService = {
  // Get all themes with optional pagination
  getAll: (params = {}) => axiosInstance.get("/themes", { params }),

  // Get theme by ID
  getById: (id) => axiosInstance.get(`/themes/${id}`),

  // Get theme by slug
  getBySlug: (slug) => axiosInstance.get(`/themes/slug/${slug}`),

  // Get theme statistics
  getStats: (id) => axiosInstance.get(`/themes/${id}/stats`),

  // Follow/unfollow theme
  toggleFollow: (id) => axiosInstance.post(`/themes/${id}/follow`),

  // Like/unlike theme
  toggleLike: (id) => axiosInstance.post(`/themes/${id}/like`),

  // Report theme
  report: (id, data) => axiosInstance.post(`/themes/${id}/report`, data),

  // Create new theme (supports FormData for file upload)
  create: (formData) => axiosInstance.post("/themes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  // Update theme (supports FormData for file upload)
  update: (id, formData) => axiosInstance.put(`/themes/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  // Delete theme
  delete: (id) => axiosInstance.delete(`/themes/${id}`),

  // Get discussions for a theme
  getDiscussions: (id, params = {}) => axiosInstance.get(`/themes/${id}/discussions`, { params }),
}

export default themeService
