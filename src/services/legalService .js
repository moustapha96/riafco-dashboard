import axiosInstance from "./api";

// Service pour les mentions légales
const legalService = {
  getAll: () => axiosInstance.get('/legal'),
  getById: (id) => axiosInstance.get(`/legal/${id}`),
  create: (data) => axiosInstance.post('/legal', data),
  update: (id, data) => axiosInstance.put(`/legal/${id}`, data),
  delete: (id) => axiosInstance.delete(`/legal/${id}`),
};

export default legalService;