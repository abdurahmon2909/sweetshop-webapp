import { create } from 'zustand';
import { Cart } from '../types';
import { cartApi } from '../api/cart';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: (telegramId: number) => Promise<void>;
  addItem: (telegramId: number, productId: number, qty: number) => Promise<void>;
  updateItem: (itemId: number, telegramId: number, qty: number) => Promise<void>;
  removeItem: (itemId: number, telegramId: number) => Promise<void>;
  clearCart: (telegramId: number) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async (telegramId: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.getCart(telegramId);
      set({ cart, isLoading: false });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ error: 'Savatni yuklashda xatolik', isLoading: false });
    }
  },

  addItem: async (telegramId: number, productId: number, qty: number) => {
    try {
      const cart = await cartApi.addItem(telegramId, productId, qty);
      set({ cart });
    } catch (error) {
      console.error('Error adding item:', error);
      set({ error: 'Mahsulotni qo\'shishda xatolik' });
    }
  },

  updateItem: async (itemId: number, telegramId: number, qty: number) => {
    try {
      const cart = await cartApi.updateItem(itemId, telegramId, qty);
      set({ cart });
    } catch (error) {
      console.error('Error updating item:', error);
      set({ error: 'Mahsulot miqdorini o\'zgartirishda xatolik' });
    }
  },

  removeItem: async (itemId: number, telegramId: number) => {
    try {
      const cart = await cartApi.removeItem(itemId, telegramId);
      set({ cart });
    } catch (error) {
      console.error('Error removing item:', error);
      set({ error: 'Mahsulotni o\'chirishda xatolik' });
    }
  },

  clearCart: async (telegramId: number) => {
    try {
      const cart = await cartApi.clearCart(telegramId);
      set({ cart });
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ error: 'Savatni tozalashda xatolik' });
    }
  },
}));