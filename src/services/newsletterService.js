import axiosInstance from "./api";

const newsletterService = {
  // CRUD Newsletter
  getAll: (params) => axiosInstance.get("/newsletter", { params }), // support pagination & search
  getById: (id) => axiosInstance.get(`/newsletter/${id}`),
  create: (data) => axiosInstance.post("/newsletter", data),
  update: (id, data) => axiosInstance.put(`/newsletter/${id}`, data),
  delete: (id) => axiosInstance.delete(`/newsletter/${id}`),
  subscribe: (email) => axiosInstance.post(`/newsletter/subscribe/${email}`),
  unsubscribe: (email) => axiosInstance.post(`/newsletter/unsubscribe/${email}`),
};

export default newsletterService;
