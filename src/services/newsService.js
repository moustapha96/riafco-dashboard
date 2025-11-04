import axiosInstance from "./api";


const newsService = {
    getAll: (params) => axiosInstance.get('/news', { params }),
    getById: (id) => axiosInstance.get(`/news/${id}`),
    create: (formData) => axiosInstance.post('/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, formData) => axiosInstance.put(`/news/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => axiosInstance.delete(`/news/${id}`),


    getNewsletterSubscribers: (newsId) => axiosInstance.get(`/news/${newsId}/newsletter/subscribers`),
    subscribeToNewsletter: (newsId, email) => axiosInstance.get(`/news/${newsId}/newsletter/${email}/subscribe`),
    unsubscribeFromNewsletter: (newsId, email) => axiosInstance.get(`/news/${newsId}/newsletter/${email}/unsubscribe`),
    getCampaigns: (id) => axiosInstance.get(`/news/${id}/campaigns`),

    updateValidatedStatus: (id, validated) => axiosInstance.put(`/news/${id}/validated`, { validated }),

    updateStatus: (id, status) => axiosInstance.put(`/news/${id}/status`, { status }),

};

export default newsService;