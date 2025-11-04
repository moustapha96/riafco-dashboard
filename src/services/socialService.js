import axiosInstance from "./api";


// Service pour les réseaux sociaux
export const socialService = {
  getAll: () => axiosInstance.get('/social'),
  create: (data) => axiosInstance.post('/social', data),
  update: (id, data) => axiosInstance.put(`/social/${id}`, data),
  delete: (id) => axiosInstance.delete(`/social/${id}`),
};

export default socialService;
