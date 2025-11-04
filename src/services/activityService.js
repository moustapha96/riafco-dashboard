import axiosInstance from "./api"

// Service pour les activités
export const activityService = {
  getAll: (params) => axiosInstance.get(`/activities`,{params}),
  getById: (id) => axiosInstance.get(`/activities/${id}`),
  create: (formData) =>
    axiosInstance.post("/activities", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    axiosInstance.put(`/activities/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => axiosInstance.delete(`/activities/${id}`),
  updateStatus: (id, status) => axiosInstance.patch(`/activities/${id}/status`, { status }),
}

export default activityService
