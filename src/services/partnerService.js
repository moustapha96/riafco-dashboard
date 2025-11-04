import axiosInstance from "./api";


// Service pour les partenaires
 const partnerService = {
  getAll: () => axiosInstance.get('/partners'),
  getById: (id) => axiosInstance.get(`/partners/${id}`),
  create: (formData) => axiosInstance.post('/partners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => axiosInstance.put(`/partners/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosInstance.delete(`/partners/${id}`),
};

export default partnerService;