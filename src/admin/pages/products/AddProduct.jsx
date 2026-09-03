import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../../components/products/ProductForm';
import { productService } from '../../services/productService';

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
      navigate('/admin/products');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/admin/products"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} /> Back to products
        </Link>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Add Product</h1>
        <p className="mt-1 text-sm text-neutral-500">Create a new product in your catalog.</p>
      </div>

      <div className="border border-neutral-200 bg-white p-6 shadow-sm">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" submitting={submitting} />
      </div>
    </div>
  );
}
