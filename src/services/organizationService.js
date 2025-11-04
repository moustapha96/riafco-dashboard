import axiosInstance from "./api"

// Service pour la gestion organisationnelle
const organizationService = {
  // About Us
  getAboutUs: () => axiosInstance.get("/about-us"),
  getAllAboutUs: () => axiosInstance.get("/about-us/all"),
  
  updateAboutUs: (id, formData) =>
    axiosInstance.put(`/about-us/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  createAboutUs: (formData) =>
    axiosInstance.post("/about-us", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  
  // History
  getHistory: (params = {}) => axiosInstance.get("/history", { params }),
  createHistoryEvent: (data) => axiosInstance.post("/history", data),
  updateHistoryEvent: (id, data) => axiosInstance.put(`/history/${id}`, data),
  deleteHistoryEvent: (id) => axiosInstance.delete(`/history/${id}`),

  // Reports (Gouvernance)
  getReports: (params = {}) => axiosInstance.get("/governance-reports", { params }),
  createReport: (formData) =>
    axiosInstance.post("/governance-reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateReport: (id, formData) =>
    axiosInstance.put(`/governance-reports/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteReport: (id) => axiosInstance.delete(`/governance-reports/${id}`),
}

export default organizationService
