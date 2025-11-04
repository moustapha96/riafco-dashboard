import axiosInstance from "./api";


// Service pour les flux sociaux
export const socialFeedService = {
  getAll: (params) => axiosInstance.get('/social-feeds', { params }),
  getById: (id) => axiosInstance.get(`/social-feeds/${id}`),
  create: (data) => axiosInstance.post('/social-feeds', data),
  update: (id, data) => axiosInstance.put(`/social-feeds/${id}`, data),
  delete: (id) => axiosInstance.delete(`/social-feeds/${id}`),
};


export default socialFeedService;