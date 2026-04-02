const BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { authStorage } from '../lib/auth-storage';

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStorage.getToken()}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        authStorage.removeToken();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      const data = await response.json();
      throw new Error(data.error || data.message || 'Something went wrong');
    }

    return response.json();
  },

  post: async <T>(endpoint: string, body: any, keepalive: boolean = false): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStorage.getToken()}`
      },
      body: JSON.stringify(body),
      keepalive
    });

    if (!response.ok) {
      if (response.status === 401) {
        authStorage.removeToken();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      const data = await response.json();
      throw new Error(data.error || data.message || 'Something went wrong');
    }

    return response.json();
  }
};
