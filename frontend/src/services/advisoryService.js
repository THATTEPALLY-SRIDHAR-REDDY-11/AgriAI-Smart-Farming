import api from './api';

export const advisoryService = {
  async getAdvisory(farmerId, payload) {
    const response = await api.post(`/advisory/farmer/${farmerId}`, payload);
    return response.data;
  },

  async getHistory(farmerId) {
    const response = await api.get(`/advisory/history/${farmerId}`);
    return response.data;
  }
};
