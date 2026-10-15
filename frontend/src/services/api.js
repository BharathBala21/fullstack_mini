import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach user identifier from localStorage if present
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('savorcraft_user_id') || 'guest_user';
  config.headers['x-user-id'] = userId;
  return config;
});

export const recipeApi = {
  // GET /api/recipes?search=...
  getRecipes: async (params = {}) => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  // GET /api/recipes/:id
  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // POST /api/recipes (supports both JSON and FormData)
  createRecipe: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await api.post('/recipes', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  // PUT /api/recipes/:id (supports both JSON and FormData)
  updateRecipe: async (id, data) => {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/recipes/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  // DELETE /api/recipes/:id
  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  // POST /api/recipes/:id/like
  likeRecipe: async (id, userId) => {
    const response = await api.post(`/recipes/${id}/like`, { userId });
    return response.data;
  },

  // POST /api/recipes/:id/save
  saveRecipe: async (id, userId) => {
    const response = await api.post(`/recipes/${id}/save`, { userId });
    return response.data;
  },

  // GET /api/recipes/categories
  getCategories: async () => {
    const response = await api.get('/recipes/categories');
    return response.data;
  },

  // POST /api/upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // GET /api/health
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
