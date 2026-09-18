import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../../../components/admin/common/Card';
import AdminButton from '../../../components/admin/common/AdminButton';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import AdminLoading from '../../../components/common/Loading';
import { formatDate } from '../../../utils/formatDate';
import { formatPrice } from '../../../utils/formatPrice';
import { collectionService } from '../../../services/admin/collectionService';

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    collectionService.getById(id).then((data) => {
      if (!data) {
        setError('Collection not found');
        return;
      }
      setCollection(data);
    }).catch((err) => {
      setError(err?.response?.data?.message || 'Failed to load collection.');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-5">
        <Link to="/admin/store/collections" className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
          <ArrowLeft size={16} /> Back to collections
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Collection Details</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <AdminButton variant="primary" onClick={() => navigate('/admin/store/collections')} className="mt-3">Go Back</AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/store/collections"
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to collections
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Collection Details</h1>
        </div>
        <div className="flex gap-2">
          <AdminButton variant="primary" onClick={() => navigate(`/admin/store/collections/${id}/edit`)}>
            Edit Collection
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Collection Information" subtitle="Details about this collection">
            <div className="p-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Name</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{collection.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Slug</p>
                  <p className="mt-1 text-sm text-slate-600">/{collection.slug}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={collection.is_active ? 'Active' : 'Inactive'} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Sort Order</p>
                  <p className="mt-1 text-sm text-slate-600">{collection.sort_order}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Description</p>
                  <p className="mt-1 text-sm text-slate-600">{collection.description || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Created</p>
                  <p className="mt-1 text-sm text-slate-600">{formatDate(collection.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Updated</p>
                  <p className="mt-1 text-sm text-slate-600">{formatDate(collection.updated_at)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Collection Image" subtitle="Current image">
            <div className="p-5">
              {collection.image_path ? (
                <img src={collection.image_path} alt={collection.name} className="h-40 w-full rounded-lg border border-admin-border object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-admin-border bg-admin-card-elevated text-sm text-slate-400">
                  No image
                </div>
              )}
            </div>
          </Card>

          <Card title="Products" subtitle={`${collection.products_count ?? 0} products in this collection`}>
            <div className="p-5 text-center">
              <p className="text-2xl font-bold text-slate-900">{collection.products_count ?? 0}</p>
              <p className="text-sm text-slate-500">Total Products</p>
            </div>
          </Card>
        </div>
      </div>

      {collection.products && collection.products.length > 0 && (
        <Card title="Products in this Collection" subtitle={`${collection.products.length} products`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-admin-border bg-admin-table-header">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border-subtle">
                {collection.products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-admin-primary-light/20">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-400">/{product.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{product.category?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900">{formatPrice(product.price)}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={product.is_active ? 'Active' : 'Inactive'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
