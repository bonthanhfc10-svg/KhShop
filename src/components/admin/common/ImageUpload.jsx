import { useState, useRef } from 'react';
import { Upload, X, GripVertical, ImagePlus } from 'lucide-react';

export default function ImageUpload({
  images = [],
  onImagesChange,
  maxImages = 6,
  recommendText = 'Recommended: square, high resolution, clean background.',
  single = false,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    if (!files) return;
    const incoming = Array.from(files).map((file) => URL.createObjectURL(file));
    const next = single ? incoming.slice(0, 1) : [...images, ...incoming].slice(0, maxImages);
    onImagesChange(next);
  };

  const remove = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onImagesChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
          >
            <img src={img} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Main
              </span>
            )}
            <button
              onClick={() => remove(i)}
              aria-label="Remove image"
              className="absolute right-1.5 top-1.5 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={12} />
            </button>
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-black/40 py-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move left"
                className="p-0.5 text-white disabled:opacity-30"
              >
                <GripVertical size={14} className="rotate-0" />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1}
                aria-label="Move right"
                className="text-xs font-medium text-white disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed text-neutral-400 transition-colors ${
              dragOver ? 'border-neutral-900 bg-neutral-50 text-neutral-900' : 'border-neutral-300 hover:border-neutral-400'
            }`}
          >
            <Upload size={20} />
            <span className="text-xs font-medium">
              {images.length === 0 ? 'Upload image' : 'Add image'}
            </span>
          </button>
        )}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
        <ImagePlus size={14} /> {recommendText}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={!single}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
