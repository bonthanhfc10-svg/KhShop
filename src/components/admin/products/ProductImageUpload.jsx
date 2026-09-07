import ImageUpload from '../common/ImageUpload';

export default function ProductImageUpload({ images = [], onImagesChange, single = false, maxImages = 6, label = '' }) {
  return (
    <div>
      {label && (
        <p className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</p>
      )}
      <ImageUpload images={images} onImagesChange={onImagesChange} single={single} maxImages={maxImages} />
    </div>
  );
}
