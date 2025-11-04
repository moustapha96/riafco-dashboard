import axiosInstance from "./api"

// Service pour les IFCL (ex-pays membres)
export const ifclService = {
  getAll: (params) => axiosInstance.get("/member-countries", { params }),
  getAllOf : () => axiosInstance.get("/member-countries/all"),
  getById: (id) => axiosInstance.get(`/member-countries/${id}`),
  create: (data) => axiosInstance.post("/member-countries", data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  update: (id, data) => axiosInstance.put(`/member-countries/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id) => axiosInstance.delete(`/member-countries/${id}`),
  
  uploadFlag: (formData) => axiosInstance.post('/member-countries/upload-flag',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  // Gestion des critères (CritereMemberCountry)
  getCriteria: (countryId) => axiosInstance.get(`/member-countries/${countryId}/criteria`),
  addCriterion: (countryId, data) => axiosInstance.post(`/member-countries/${countryId}/criteria`, data),
  updateCriterion: (criterionId, data) => axiosInstance.put(`/member-countries/criteria/${criterionId}`, data),
  deleteCriterion: (criterionId) => axiosInstance.delete(`/member-countries/criteria/${criterionId}`),

  // Fonctions utilitaires (basées sur les endpoints existants)
  getActiveMemberCountries: () => axiosInstance.get("/member-countries", { params: { status: "ACTIVE" } }),
  searchMemberCountries: (searchTerm) => axiosInstance.get("/member-countries", { params: { search: searchTerm } }),

}

export default ifclService


