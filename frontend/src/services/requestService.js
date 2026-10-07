import api from './api';

export const requestService = {
  async createRequest(buyerId, productId, requestedQuantity, message) {
    const response = await api.post('/requests', null, {
      params: { buyerId, productId, requestedQuantity, message }
    });
    return response.data;
  },

  async getFarmerRequests(farmerId) {
    const response = await api.get(`/requests/farmer/${farmerId}`);
    return response.data;
  },

  async getBuyerRequests(buyerId) {
    const response = await api.get(`/requests/buyer/${buyerId}`);
    return response.data;
  },

  async updateStatus(requestId, status) {
    const response = await api.patch(`/requests/${requestId}/status?status=${status}`);
    return response.data;
  }
};
