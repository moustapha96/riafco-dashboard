import axiosInstance from "./api"

const discussionService = {
  // Get all discussions with optional filters
  getAll: (params = {}) => axiosInstance.get("/discussions", { params }),

  // Get discussion by ID
  getById: (id) => axiosInstance.get(`/discussions/${id}`),

  // Create new discussion
  create: (data) => axiosInstance.post("/discussions", data),

  // Update discussion
  update: (id, data) => axiosInstance.put(`/discussions/${id}`, data),

  // Delete discussion
  delete: (id) => axiosInstance.delete(`/discussions/${id}`),

  // Toggle pin status (renamed from toggleSticky)
  togglePin: (id) => axiosInstance.post(`/discussions/${id}/pin`),

  // Toggle close status (renamed from toggleLock)
  toggleClose: (id) => axiosInstance.post(`/discussions/${id}/close`),

  // Get comments for a discussion
  getComments: (id, params = {}) => axiosInstance.get(`/discussions/${id}/comments`, { params }),

  // Add comment to discussion
  addComment: (id, data) => axiosInstance.post(`/discussions/${id}/comments`, data),

  // Like/unlike discussion
  toggleLike: (id) => axiosInstance.post(`/discussions/${id}/like`),

  // Report discussion
  report: (id, data) => axiosInstance.post(`/discussions/${id}/report`, data),

  // Get discussions by user
  getByUser: (userId, params = {}) => axiosInstance.get(`/discussions/user/${userId}`, { params }),

  getByTheme: (themeId) => axiosInstance.get(`/discussions/theme/${themeId}`),

  getByThemeWithComments: (themeId) => axiosInstance.get(`/discussions/theme/${themeId}/with-comments`),

  getDiscussionComments: (id) => axiosInstance.get(`/discussions/${id}/comments`),

  getDiscussionReplies: (id) => axiosInstance.get(`/discussions/${id}/replies`),

  addCommentDiscussion : (id, data) => axiosInstance.post(`/discussions/${id}/comments`, data),
}

export default discussionService
