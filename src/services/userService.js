import axiosInstance from './api';

const userService = {
  getAll: (params) => axiosInstance.get('/users', { params }),
  getStats: () => axiosInstance.get('/users/stats'),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  create: (formData) => axiosInstance.post('/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => axiosInstance.put(`/users/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
  resetPassword: (id) => axiosInstance.post(`/users/${id}/reset-password`),

  sendMailToUser : (body) => axiosInstance.post('/users/send-mail', body),

};

export default userService;
