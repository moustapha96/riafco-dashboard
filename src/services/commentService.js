import axiosInstance from "./api"

const commentService = {
  // Get all comments for a discussion
  getAll: (discussionId, params = {}) => axiosInstance.get(`/discussions/${discussionId}/comments`, { params }),

  // Get comment by ID
  getById: (id) => axiosInstance.get(`/comments/${id}`),

  // Create new comment
  create: (discussionId, data) => axiosInstance.post(`/discussions/${discussionId}/comments`, data),

  // Update comment
  update: (id, data) => axiosInstance.put(`/comments/${id}`, data),

  // Delete comment
  delete: (id) => axiosInstance.delete(`/comments/${id}`),

  // Reply to comment
  reply: (parentId, data) => axiosInstance.post(`/comments/${parentId}/reply`, data),

  // Get all comments with pagination
  getAllComments: (params = {}) => axiosInstance.get("/comments", { params }),

  // Get replies to a comment
  getReplies: (id, params = {}) => axiosInstance.get(`/comments/${id}/replies`, { params }),

  // Get comments by user
  getByUser: (userId, params = {}) => axiosInstance.get(`/comments/user/${userId}`, { params }),

  // Like/unlike comment
  toggleLike: (id) => axiosInstance.post(`/comments/${id}/like`),

  // Report comment
  report: (id, data) => axiosInstance.post(`/comments/${id}/report`, data),

  replyToComment: (discussionId, commentId, data) => axiosInstance.post(`/discussions/${discussionId}/comments/${commentId}/reply`, data),

  // POST /api/discussions/:discussionId/comments/:commentId/like - Like/Unlike a comment
  likeComment: (discussionId, commentId) => axiosInstance.post(`/discussions/${discussionId}/comments/${commentId}/like`),

}

export default commentService
