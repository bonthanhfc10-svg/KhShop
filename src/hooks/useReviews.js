import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services/reviewService';

export function useReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await reviewService.getReviews(productId);
      const data = res?.data;
      setReviews(data?.reviews || []);
      setStats(data?.stats || { total: 0, average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const createReview = useCallback(async (payload) => {
    const res = await reviewService.createReview(productId, payload);
    const newReview = res?.data?.review;
    if (newReview) {
      setReviews((prev) => [newReview, ...prev]);
      setStats((prev) => {
        const newTotal = prev.total + 1;
        const newAvg = ((prev.average * prev.total) + payload.rating) / newTotal;
        return {
          total: newTotal,
          average: Math.round(newAvg * 10) / 10,
          distribution: {
            ...prev.distribution,
            [payload.rating]: (prev.distribution[payload.rating] || 0) + 1,
          },
        };
      });
    }
    return res;
  }, [productId]);

  const updateReview = useCallback(async (reviewId, payload) => {
    const res = await reviewService.updateReview(reviewId, payload);
    const updated = res?.data?.review;
    if (updated) {
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      if (payload.rating !== undefined) {
        fetchReviews();
      }
    }
    return res;
  }, [fetchReviews]);

  const deleteReview = useCallback(async (reviewId) => {
    const res = await reviewService.deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    fetchReviews();
    return res;
  }, [fetchReviews]);

  return {
    reviews,
    stats,
    loading,
    error,
    createReview,
    updateReview,
    deleteReview,
    reload: fetchReviews,
  };
}
