import api from './api';

export const paymentsService = {
  createCheckout: (courseId: string) =>
    api.post<{ url: string }>(`/payments/checkout/${courseId}`).then((r) => r.data),
};
