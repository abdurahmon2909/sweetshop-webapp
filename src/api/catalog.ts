import { apiClient } from './client';
import { Category, Product } from '../types';

export const catalogApi = {
  getCatalog: async (): Promise<{ categories: Category[]; products: Product[] }> => {
    const response = await apiClient.get('/catalog');
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/catalog/categories');
    return response.data;
  },

  getProducts: async (categoryId?: number): Promise<Product[]> => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await apiClient.get('/catalog/products', { params });
    return response.data;
  },

  getProduct: async (productId: number): Promise<Product> => {
    const response = await apiClient.get(`/catalog/products/${productId}`);
    return response.data;
  },
};