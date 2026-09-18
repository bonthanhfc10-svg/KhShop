import api from './api';

export const reviewService = {
  async getReviews(productId) {
    const { data } = await api.get(`/v1/products/${productId}/reviews`);
    return data;
  },

  async createReview(productId, payload) {
    const { data } = await api.post(`/v1/products/${productId}/reviews`, payload);
    return data;
  },

  async updateReview(reviewId, payload) {
    const { data } = await api.patch(`/v1/reviews/${reviewId}`, payload);
    return data;
  },

  async deleteReview(reviewId) {
    const { data } = await api.delete(`/v1/reviews/${reviewId}`);
    return data;
  },
};

export default reviewService;
