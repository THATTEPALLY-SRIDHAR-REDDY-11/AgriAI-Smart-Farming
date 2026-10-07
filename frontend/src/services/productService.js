import api from './api';

export const productService = {
  async getMarketplace(params = {}) {
    const response = await api.get('/products/marketplace', { params });
    return response.data;
  },

  async getFarmerProducts(farmerId) {
    const response = await api.get(`/products/farmer/${farmerId}`);
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(farmerId, productData) {
    const response = await api.post(`/products/farmer/${farmerId}`, productData);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/products/${id}/status?status=${status}`);
    return response.data;
  }
};
