import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const tg = (window as any).Telegram?.WebApp;
  if (tg?.initDataUnsafe?.user) {
    config.params = {
      ...config.params,
      telegram_id: tg.initDataUnsafe.user.id,
    };
  }
  return config;
});