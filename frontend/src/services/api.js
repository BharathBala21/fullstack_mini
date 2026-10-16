import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, DEFAULT_USER } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID) || DEFAULT_USER.ID;
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export const recipeApi = {
  getRecipes: async (params = {}) => {
    const res = await api.get('/recipes', { params });
    return res.data;
  },

  getRecipeById: async (id) => {
    const res = await api.get(`/recipes/${id}`);
    return res.data;
  },

  createRecipe: async (data) => {
    const res = await api.post('/recipes', data);
    return res.data;
  },

  updateRecipe: async (id, data) => {
    const res = await api.put(`/recipes/${id}`, data);
    return res.data;
  },

  deleteRecipe: async (id) => {
    const res = await api.delete(`/recipes/${id}`);
    return res.data;
  },

  likeRecipe: async (id, userId) => {
    const res = await api.post(`/recipes/${id}/like`, { userId });
    return res.data;
  },

  saveRecipe: async (id, userId) => {
    const res = await api.post(`/recipes/${id}/save`, { userId });
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get('/recipes/categories');
    return res.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/upload', formData);
    return res.data;
  },

  getHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
};

export default api;
