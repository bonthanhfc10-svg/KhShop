import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeProduct = useCallback(async (id) => {
    await productService.remove(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { products, loading, error, reload: load, removeProduct };
}
