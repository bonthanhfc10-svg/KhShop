import { Star, StarHalf } from 'lucide-react';

export function Rating({ rating, reviews, showCount = true }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-accent" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full)
            return <Star key={i} size={15} className="fill-current" />;
          if (i === full && hasHalf)
            return <StarHalf key={i} size={15} className="fill-current" />;
          return <Star key={i} size={15} className="text-neutral-300" />;
        })}
      </div>
      <span className="text-sm text-neutral-600">{rating}</span>
      {showCount && reviews !== undefined && (
        <span className="text-xs text-neutral-400">({reviews})</span>
      )}
    </div>
  );
}
