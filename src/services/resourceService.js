
import axiosInstance from "./api"

const resourceService = {
  // Resources
  getAll: (params = {}) => axiosInstance.get("/resources", { params }),
  getById: (id) => axiosInstance.get(`/resources/${id}`),
  create: (formData) =>
    axiosInstance.post("/resources", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    axiosInstance.put(`/resources/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => axiosInstance.delete(`/resources/${id}`),
  download: (id) =>
    axiosInstance.get(`/resources/${id}/download`, {
      responseType: "blob",
    }),

  // Categories
  getAllCategories: () => axiosInstance.get("/resources/categories/all"),
  createCategory: (data) => axiosInstance.post("/resources/categories", data),
  updateCategory: (id, data) => axiosInstance.put(`/resources/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/resources/categories/${id}`),
}

export default resourceService
