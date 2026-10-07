import api from './api';

export const diseaseService = {
  async predictDisease(farmerId, file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(`/disease/predict/${farmerId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getHistory(farmerId) {
    const response = await api.get(`/disease/history/${farmerId}`);
    return response.data;
  }
};
