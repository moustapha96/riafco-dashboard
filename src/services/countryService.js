import axiosInstance from "./api";

// Service pour les pays
export const countryService = {
  getAll: () => axiosInstance.get('/countries'),
  getById: (id) => axiosInstance.get(`/countries/${id}`),
  create: (formData) => axiosInstance.post('/countries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => axiosInstance.put(`/countries/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosInstance.delete(`/countries/${id}`),
};

export default countryService;