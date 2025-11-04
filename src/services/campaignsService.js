import axiosInstance from "./api";



const campaignsService = {

  getAll: (params = {}) => axiosInstance.get("/campaigns", { params }),

  // Liste des campagnes d’une news précise
  getByNews: (newsId, params = {}) =>
    axiosInstance.get(`/news/${newsId}/campaigns`, { params }),

  // Détail d'une campagne
  getById: (id) => axiosInstance.get(`/campaigns/${id}`),

  // Création (le backend attend newsId dans le body)
  create: (payload) => axiosInstance.post("/campaigns", payload),

  // MAJ
  update: (id, payload) => axiosInstance.put(`/campaigns/${id}`, payload),

  // Suppression
  remove: (id) => axiosInstance.delete(`/campaigns/${id}`),

};

export default campaignsService;







