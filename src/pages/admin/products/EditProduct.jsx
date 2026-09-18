import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../../../components/admin/products/ProductForm';
import { productService } from '../../../services/admin/productService';
import AdminLoading from '../../../components/common/Loading';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    productService.getById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        category_id: form.category_id,
        brand_id: form.brand_id,
        price: form.price,
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        is_active: form.is_active,
        variants: form.variants.map(({ stock, ...rest }) => rest),
        supplier_ids: form.supplier_ids || [],
      };
      await productService.update(id, payload);
      navigate('/admin/products', { state: { toast: 'Updated successfully' } });
    } catch (err) {
      const response = err.response;
      if (response?.status === 422 && response?.data?.errors) {
        setErrors(response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/products"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to products
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Product</h1>
          <p className="mt-1 text-sm text-slate-500">
            {product?.name}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-admin-border bg-admin-card p-6 shadow-sm">
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">Please fix the following errors:</p>
            <ul className="mt-2 list-inside list-disc text-sm text-red-600">
              {Object.entries(errors).map(([field, messages]) => (
                <li key={field}>{Array.isArray(messages) ? messages[0] : messages}</li>
              ))}
            </ul>
          </div>
        )}
        <ProductForm initial={product} onSubmit={handleSubmit} onCancel={() => navigate('/admin/products')} submitLabel="Update Product" submitting={submitting} editMode />
      </div>
    </div>
  );
}
