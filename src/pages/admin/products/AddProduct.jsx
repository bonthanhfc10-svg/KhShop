import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../../../components/admin/products/ProductForm';
import { productService } from '../../../services/admin/productService';

export default function AddProduct() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      await productService.create({
        ...form,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        salePrice: form.salePrice ? Number(form.salePrice) : null,
      });
      navigate('/admin/products', { state: { toast: 'Created successfully' } });
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Product</h1>
          <p className="mt-1 text-sm text-slate-500">Create a new product in your catalog.</p>
        </div>
      </div>

      <div className="rounded-xl border border-admin-border bg-admin-card p-6 shadow-sm">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" submitting={submitting} buttonVariant="success" />
      </div>
    </div>
  );
}
