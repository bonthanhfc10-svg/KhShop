import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../../components/products/ProductForm';
import { productService } from '../../services/productService';
import AdminLoading from '../../components/common/Loading';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productService.getById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      await productService.update(id, {
        ...form,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        salePrice: form.salePrice ? Number(form.salePrice) : null,
      });
      navigate('/admin/products');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/admin/products"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Back to products
        </Link>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Edit Product</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {product?.name} · {product?.sku || 'No SKU'}
        </p>
      </div>

      <div className="border border-neutral-200 bg-white p-6 shadow-sm">
        <ProductForm initial={product} onSubmit={handleSubmit} submitLabel="Update Product" submitting={submitting} />
      </div>
    </div>
  );
}
