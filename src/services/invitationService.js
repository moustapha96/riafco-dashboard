// import axiosInstance from "./api";

// // Service pour les invitations
//  const invitationService = {
//   getAll: () => axiosInstance.get('/invitations'),
//   create: (formData) => axiosInstance.post('/invitations', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }),
//   accept: (token, data) => axiosInstance.post(`/invitations/${token}/accept`, data),
// };

// export default invitationService;

import axiosInstance from "./api"

const invitationService = {
  // Get all invitations with optional filters
  getAll: (params = {}) => axiosInstance.get("/invitations", { params }),

  // Get invitation by ID
  getById: (id) => axiosInstance.get(`/invitations/${id}`),

  // Create new invitation
  create: (formData) =>
    axiosInstance.post("/invitations", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  // Update invitation
  update: (id, data) => axiosInstance.put(`/invitations/${id}`, data),

  // Delete invitation
  delete: (id) => axiosInstance.delete(`/invitations/${id}`),

  // Accept invitation
  accept: (token, data) => axiosInstance.post(`/invitations/${token}/accept`, data),

  // Reject invitation
  reject: (token) => axiosInstance.post(`/invitations/${token}/reject`),

  // Resend invitation
  resend: (id) => axiosInstance.post(`/invitations/${id}/resend`),
}

export default invitationService
