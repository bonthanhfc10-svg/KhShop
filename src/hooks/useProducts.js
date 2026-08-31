import { useEffect, useState } from 'react';
import {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getSaleProducts,
  getProductsByCategory,
  searchProducts,
  getProductById,
  getRelatedProducts,
} from '../data/products';
import { productService } from '../services/productService';
import { USE_MOCK } from '../services/config';

const DATA_SOURCES = {
  featured: getFeaturedProducts,
  new: getNewArrivals,
  best: getBestSellers,
  sale: getSaleProducts,
  category: getProductsByCategory,
  search: searchProducts,
  related: getRelatedProducts,
};

export function useProducts(source, params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 300));
          const fn = DATA_SOURCES[source] || (() => []);
          const result =
            source === 'category'
              ? fn(params.category)
              : source === 'search'
              ? fn(params.query)
              : source === 'related'
              ? fn(params.product)
              : fn(params.count);
          if (active) setProducts(result);
        } else {
          let result = [];
          if (source === 'featured') result = await productService.getFeatured();
          else if (source === 'new') result = await productService.getNewArrivals();
          else if (source === 'related')
            result = await productService.getRelated(params.product?.id);
          else if (source === 'search')
            result = await productService.search(params.query);
          else result = await productService.getProducts(params);
          if (active) setProducts(result);
        }
      } catch (err) {
        if (active) setError(err.message);
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

  return { products, loading, error };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 300));
          const p = getProductById(id);
          if (active) setProduct(p || null);
        } else {
          const p = await productService.getProduct(id);
          if (active) setProduct(p);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  return { product, loading, error };
}
