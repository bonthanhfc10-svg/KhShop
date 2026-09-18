import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useProduct } from '../../../hooks/useProducts';
import { useReviews } from '../../../hooks/useReviews';
import { useAuth } from '../../../store/AuthContext';
import Loading from '../../../components/common/Loading';
import NotFound from '../error/NotFound';
import DetailBreadcrumb from '../../../components/common/DetailBreadcrumb';
import ProductGallery from '../../../components/customer/product/ProductGallery';
import ProductDetails from '../../../components/customer/product/ProductDetails';
import ProductReviews from '../../../components/customer/product/ProductReviews';
import RelatedProducts from '../../../components/customer/product/RelatedProducts';

export default function ProductDetail() {
  const { productSlug } = useParams();
  const location = useLocation();
  const { product, loading, error } = useProduct(productSlug);
  const { user } = useAuth();
  const breadcrumbContext = location.state?.breadcrumbContext || [];

  const defaultColor = product?.colors?.[0];
  const [selectedColorId, setSelectedColorId] = useState(() => defaultColor?.id ?? null);

  useEffect(() => {
    if (defaultColor) setSelectedColorId(defaultColor.id);
  }, [defaultColor]);

  const selectedColor =
    product?.colors?.find((c) => c.id === selectedColorId) || defaultColor || null;
  const galleryImages = selectedColor?.images || [];

  const productForDetails = product
    ? {
        ...product,
        sizes: selectedColor?.sizes || [],
        stock: selectedColor?.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0,
      }
    : null;

  const handleColorChange = (color) => setSelectedColorId(color.id);

  const {
    reviews,
    stats,
    loading: reviewsLoading,
    error: reviewsError,
    createReview,
    updateReview,
    deleteReview,
  } = useReviews(product?.id);

  if (loading) return <main className="container-kh"><Loading full /></main>;
  if (error) return <main className="container-kh py-20 text-center text-neutral-500">{error}</main>;
  if (!product) return <NotFound />;

  return (
    <main>
      <div className="container-kh pt-4">
        <DetailBreadcrumb context={breadcrumbContext} current={product.name} />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={galleryImages} name={product.name} />
          <ProductDetails
            product={productForDetails}
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
          />
        </div>
      </div>

      <section className="container-kh mt-8 border-t border-neutral-200 pt-12">
        <h2 className="heading-display mb-8 text-2xl sm:text-3xl">Reviews</h2>
        <ProductReviews
          productId={product.id}
          reviews={reviews}
          stats={stats}
          loading={reviewsLoading}
          error={reviewsError}
          currentUser={user}
          onCreate={createReview}
          onUpdate={updateReview}
          onDelete={deleteReview}
        />
      </section>

      <RelatedProducts product={product} categorySlug={product.categorySlug} breadcrumbContext={breadcrumbContext} />
    </main>
  );
}
