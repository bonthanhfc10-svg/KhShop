import { useState } from 'react';
import { formatDate } from '../../../utils/formatDate';
import Button from '../../common/Button';

export default function ProductReviews({ product, reviews: reviewsProp }) {
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState({ title: '', body: '' });

  const reviews = reviewsProp || product.reviewList || [];

  const submitReview = (e) => {
    e.preventDefault();
    setShowForm(false);
    setReview({ title: '', body: '' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          {product.reviews} reviews
        </p>
        <Button variant="secondary" onClick={() => setShowForm((s) => !s)}>
          Write a Review
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={submitReview}
          className="mt-8 border border-neutral-200 bg-neutral-50 p-6"
        >
          <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
            Share your experience
          </h3>
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
                    {(r.author || r.user?.name || 'A').charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{r.author || r.user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-neutral-400">{formatDate(r.date || r.created_at)}</p>
                  </div>
                </div>
              </div>
              {r.title && (
                <h4 className="mt-3 font-sans text-sm font-bold text-neutral-900">
                  {r.title}
                </h4>
              )}
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{r.body || r.comment || ''}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
