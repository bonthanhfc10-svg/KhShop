import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import Loading from '../../components/common/Loading';
import NotFound from '../error/NotFound';
import ProductGallery from '../../components/product/ProductGallery';
import ProductDetails from '../../components/product/ProductDetails';
import ProductReviews from '../../components/product/ProductReviews';
import RelatedProducts from '../../components/product/RelatedProducts';
import { Link } from 'react-router-dom';

const TABS = ['Description', 'Details', 'Shipping'];

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const [activeTab, setActiveTab] = useState('Description');

  const defaultColor = product?.colors?.[0];
  const [selectedColorId, setSelectedColorId] = useState(() => defaultColor?.id ?? null);

  const selectedColor =
    product?.colors?.find((c) => c.id === selectedColorId) || defaultColor || null;
  const galleryImages = selectedColor?.images || product?.images || [];

  const handleColorChange = (color) => setSelectedColorId(color.id);

  if (loading) return <main className="container-kh"><Loading full /></main>;
  if (!product) return <NotFound />;

  return (
    <main>
      <div className="container-kh pt-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <ChevronRight size={12} />
          <Link to={`/shop/${product.category}`} className="hover:text-black">
            {product.categoryName}
          </Link>
          <ChevronRight size={12} />
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={galleryImages} name={product.name} />
          <ProductDetails
            product={product}
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
          />
        </div>
      </div>

      {/* Tabs */}
      <section className="container-kh mt-16 border-t border-neutral-200 pt-12 sm:mt-20">
        <div className="flex gap-1 border-b border-neutral-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-w-3xl py-8">
          {activeTab === 'Description' && (
            <p className="text-[15px] leading-relaxed text-neutral-700">
              {product.description}
            </p>
          )}
          {activeTab === 'Details' && (
            <ul className="space-y-3">
              {product.details.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                  {d}
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'Shipping' && (
            <div className="space-y-4 text-sm leading-relaxed text-neutral-700">
              <p>
                <strong>Free shipping</strong> on all orders over $50. Standard delivery 3–5
                business days.
              </p>
              <p>
                We offer free 30-day returns on all unworn items with tags attached.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="container-kh mt-8 border-t border-neutral-200 pt-12">
        <h2 className="heading-display mb-8 text-2xl sm:text-3xl">Reviews</h2>
        <ProductReviews product={product} />
      </section>

      <RelatedProducts product={product} />
    </main>
  );
}
