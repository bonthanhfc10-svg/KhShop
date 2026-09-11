import { useEffect, useState } from 'react';

export default function ProductGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const primaryImage = images?.[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [primaryImage]);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* thumbnails */}
      <div className="flex gap-3 sm:flex-col">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            onMouseEnter={() => setActiveIndex(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
            className={`aspect-square w-16 shrink-0 overflow-hidden border transition-colors sm:w-20 ${
              i === activeIndex ? 'border-black' : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* main image */}
      <div className="relative flex-1 overflow-hidden bg-white">
        <div className="group cursor-zoom-in flex h-full items-center justify-center p-6">
          <img
            key={activeIndex}
            src={images[activeIndex] || images[0]}
            alt={name}
            className="max-h-[500px] w-full animate-fade-in object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
