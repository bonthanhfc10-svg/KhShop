import { useState } from 'react';
import { Rating } from './Rating';
import { formatDate } from '../../utils/formatDate';
import Button from '../common/Button';

export default function ProductReviews({ product }) {
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState({ rating: 5, title: '', body: '' });

  const reviews = product.reviewList || [];

  const submitReview = (e) => {
    e.preventDefault();
    setShowForm(false);
    setReview({ rating: 5, title: '', body: '' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-4xl font-extrabold text-neutral-900">
            {product.rating}
          </span>
          <div>
            <Rating rating={product.rating} />
            <p className="mt-1 text-sm text-neutral-500">
              {product.reviews} reviews
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setShowForm((s) => !s)}>
          Write a Review
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={submitReview}
          className="mt-8 border border-neutral-200 bg-neutral-50 p-6"
        >
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-neutral-900">
            Share your experience
          </h3>
          <div className="mb-4">
            <span className="label-kh">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReview((v) => ({ ...v, rating: r }))}
                  aria-label={`Rate ${r} stars`}
                  className={r <= review.rating ? 'text-accent' : 'text-neutral-300'}
                >
                  <svg viewBox="0 0 20 20" width="28" height="28" fill="currentColor">
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="r-title" className="label-kh">Title</label>
            <input
              id="r-title"
              value={review.title}
              onChange={(e) => setReview((v) => ({ ...v, title: e.target.value }))}
              className="input-kh"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="r-body" className="label-kh">Review</label>
            <textarea
              id="r-body"
              rows="4"
              value={review.body}
              onChange={(e) => setReview((v) => ({ ...v, body: e.target.value }))}
              className="input-kh resize-none"
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((r) => (
            <article key={r.id} className="border-b border-neutral-200 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                    {r.author.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{r.author}</p>
                    <p className="text-xs text-neutral-400">{formatDate(r.date)}</p>
                  </div>
                </div>
                <Rating rating={r.rating} showCount={false} />
              </div>
              <h4 className="mt-3 font-display text-sm font-bold text-neutral-900">
                {r.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{r.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
