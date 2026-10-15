import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, DEFAULT_USER } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID) || DEFAULT_USER.ID;
  config.headers['x-user-id'] = userId;
  return config;
});

export const recipeApi = {
  getRecipes: async (params = {}) => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await api.post('/recipes', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  updateRecipe: async (id, data) => {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/recipes/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  likeRecipe: async (id, userId) => {
    const response = await api.post(`/recipes/${id}/like`, { userId });
    return response.data;
  },

  saveRecipe: async (id, userId) => {
    const response = await api.post(`/recipes/${id}/save`, { userId });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/recipes/categories');
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
