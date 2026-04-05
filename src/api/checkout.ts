import { apiClient } from './client';
import { CheckoutRequest, CheckoutResponse } from '../types';

export const checkoutApi = {
  createCheckout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await apiClient.post('/checkout', data);
    return response.data;
  },
};