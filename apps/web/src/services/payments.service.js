import api from './api';
export const paymentsService = {
    createCheckout: (courseId) => api.post(`/payments/checkout/${courseId}`).then((r) => r.data),
};
//# sourceMappingURL=payments.service.js.map