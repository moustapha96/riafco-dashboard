import axiosInstance from "./api";

// Service pour les membres de l'équipe
export const teamMemberService = {
  getAll: () => axiosInstance.get('/team-members'),
  getById: (id) => axiosInstance.get(`/team-members/${id}`),
  create: (formData) => axiosInstance.post('/team-members', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => axiosInstance.put(`/team-members/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosInstance.delete(`/team-members/${id}`),
  reorder: (data) => axiosInstance.put('/team-members/reorder', data),
};

export default teamMemberService;
