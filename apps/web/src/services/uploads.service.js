import api from './api';
export const uploadsService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.url;
    },
    uploadDocument: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/uploads/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.url;
    },
};
//# sourceMappingURL=uploads.service.js.map