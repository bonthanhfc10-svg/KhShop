import { useEffect, useState, useCallback } from 'react';
import { productService } from '../services/productService';

export function useProducts(source, params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        if (source === 'new') {
          const result = await productService.getNewArrivals();
          if (active) setProducts(result);
        } else if (source === 'search') {
          const result = await productService.search(params.query || '');
          if (active) setProducts(result);
        } else if (source === 'related') {
          const result = await productService.getRelated(
            params.product?.slug,
            params.categorySlug
          );
          if (active) setProducts(result);
        } else {
          const result = await productService.getProducts(params);
          if (active) {
            setProducts(result.products);
            setPage(result.page);
            setTotalPages(result.totalPages);
            setTotalCount(result.totalCount);
          }
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load products.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, JSON.stringify(params)]);

  return { products, loading, error, page, totalPages, totalCount };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const p = await productService.getProduct(slug);
        if (active) setProduct(p);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load product.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  return { product, loading, error };
}

export function useProductFilters(params = {}) {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFilters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getFilters(params);
      setFilters(data);
    } catch (err) {
      setError(err.message || 'Failed to load filters.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  return { filters, loading, error, reload: loadFilters };
}
