import axiosInstance from "./api";



export const eventService = {
  getAll: () => axiosInstance.get('/events'),
  getById: (id) => axiosInstance.get(`/events/${id}`),
  create: (formData) => axiosInstance.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => axiosInstance.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosInstance.delete(`/events/${id}`),
  register: (id, data) => axiosInstance.post(`/events/${id}/register`, data),
  getRegistrations: (id) => axiosInstance.get(`/events/${id}/registrations`),
  exportRegistrations: (id) => axiosInstance.get(`/events/${id}/registrations/export`),
};

export default eventService;