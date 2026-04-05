import { apiClient } from './client';
import { Cart } from '../types';

export const cartApi = {
  getCart: async (telegramId: number): Promise<Cart> => {
    const response = await apiClient.get('/cart', { params: { telegram_id: telegramId } });
    return response.data;
  },

  addItem: async (telegramId: number, productId: number, qty: number): Promise<Cart> => {
    const response = await apiClient.post('/cart/items', {
      telegram_id: telegramId,
      product_id: productId,
      qty
    });
    return response.data;
  },

  updateItem: async (itemId: number, telegramId: number, qty: number): Promise<Cart> => {
    const response = await apiClient.patch(`/cart/items/${itemId}`, {
      telegram_id: telegramId,
      qty
    });
    return response.data;
  },

  removeItem: async (itemId: number, telegramId: number): Promise<Cart> => {
    const response = await apiClient.delete(`/cart/items/${itemId}`, {
      params: { telegram_id: telegramId }
    });
    return response.data;
  },

  clearCart: async (telegramId: number): Promise<Cart> => {
    const response = await apiClient.post('/cart/clear', { telegram_id: telegramId });
    return response.data;
  },
};