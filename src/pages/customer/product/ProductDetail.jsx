import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useProduct } from '../../../hooks/useProducts';
import Loading from '../../../components/common/Loading';
import NotFound from '../error/NotFound';
import DetailBreadcrumb from '../../../components/common/DetailBreadcrumb';
import ProductGallery from '../../../components/customer/product/ProductGallery';
import ProductDetails from '../../../components/customer/product/ProductDetails';
import ProductReviews from '../../../components/customer/product/ProductReviews';
import RelatedProducts from '../../../components/customer/product/RelatedProducts';

export default function ProductDetail() {
  const { id: slug } = useParams();
  const location = useLocation();
  const { product, loading, error } = useProduct(slug);
  const breadcrumbContext = location.state?.breadcrumbContext || [];
  const [reviews, setReviews] = useState([]);

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

  useEffect(() => {
    if (product?.reviewList?.length) {
      setReviews(product.reviewList);
    } else if (product?.reviews) {
      setReviews([
        {
          id: 1,
          author: 'Customer',
          rating: 5,
          date: new Date().toISOString().slice(0, 10),
          title: 'Great product!',
          body: 'Really happy with this purchase. Would recommend.',
        },
      ]);
    }
  }, [product]);

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
        <ProductReviews product={product} reviews={reviews} />
      </section>

      <RelatedProducts product={product} categorySlug={product.categorySlug} breadcrumbContext={breadcrumbContext} />
    </main>
  );
}
