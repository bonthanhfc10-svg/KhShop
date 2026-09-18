import { useState } from 'react';
import { Star, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';
import { useAuth } from '../../../store/AuthContext';

function StarSelector({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="disabled:cursor-default"
        >
          <Star
            size={22}
            className={`transition-colors ${
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-neutral-200 text-neutral-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ onSubmit, onCancel, initial, submitting, error }) {
  const [rating, setRating] = useState(initial?.rating || 0);
  const [comment, setComment] = useState(initial?.comment || '');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setLocalError('Please select a rating.');
      return;
    }
    if (!comment.trim()) {
      setLocalError('Please write a review.');
      return;
    }
    setLocalError(null);
    await onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="border border-neutral-200 bg-neutral-50 p-6">
      <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-widest text-neutral-900">
        {initial ? 'Edit your review' : 'Share your experience'}
      </h3>

      <div className="mb-4">
        <label className="label-kh">Rating</label>
        <StarSelector value={rating} onChange={setRating} disabled={submitting} />
      </div>

      <div className="mb-4">
        <label htmlFor="review-comment" className="label-kh">Review</label>
        <textarea
          id="review-comment"
          rows="4"
          value={comment}
          onChange={(e) => { setComment(e.target.value); setLocalError(null); }}
          className="input-kh resize-none"
          placeholder="What did you like or dislike about this product?"
          disabled={submitting}
          required
        />
      </div>

      {(localError || error) && (
        <p className="mb-4 text-sm text-accent">{localError || error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {initial ? 'Update Review' : 'Submit Review'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ReviewStats({ stats }) {
  if (!stats || stats.total === 0) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <div className="text-center sm:text-left">
        <p className="text-4xl font-bold text-neutral-900">{stats.average}</p>
        <p className="mt-1 text-sm text-neutral-500">out of 5</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.distribution?.[star] || 0;
          const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="w-3 text-xs text-neutral-500">{star}</span>
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <div className="h-2 flex-1 overflow-hidden bg-neutral-100">
                <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-6 text-right text-xs text-neutral-400">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductReviews({ productId, reviews, stats, loading, error, currentUser, onCreate, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const userReview = currentUser ? reviews.find((r) => r.user_id === currentUser.id) : null;

  const canReview = currentUser && !userReview;

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (editingReview) {
        await onUpdate(editingReview.id, values);
        setEditingReview(null);
      } else {
        await onCreate(values);
        setShowForm(false);
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    setDeletingId(reviewId);
    try {
      await onDelete(reviewId);
    } catch {
      // error handled by hook
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Stats */}
      <ReviewStats stats={stats} />

      {/* Write a Review */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          {stats?.total || 0} {(stats?.total || 0) === 1 ? 'review' : 'reviews'}
        </p>
        {currentUser && !showForm && !editingReview && !userReview && (
          <button onClick={() => setShowForm(true)} className="btn-secondary text-sm">
            Write a Review
          </button>
        )}
        {!currentUser && (
          <Link to="/login" state={{ from: window.location.pathname }} className="btn-secondary text-sm">
            Login to Review
          </Link>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mt-6">
          <ReviewForm
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setSubmitError(null); }}
            submitting={submitting}
            error={submitError}
          />
        </div>
      )}

      {editingReview && (
        <div className="mt-6">
          <ReviewForm
            initial={editingReview}
            onSubmit={handleSubmit}
            onCancel={() => { setEditingReview(null); setSubmitError(null); }}
            submitting={submitting}
            error={submitError}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-8 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse border-b border-neutral-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-neutral-200" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 rounded bg-neutral-200" />
                  <div className="h-2.5 w-16 rounded bg-neutral-200" />
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-3 w-full rounded bg-neutral-200" />
                <div className="h-3 w-3/4 rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-8 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && reviews.length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">
          No reviews yet. Be the first to review this product!
        </p>
      )}

      {/* Reviews list */}
      {!loading && !error && reviews.length > 0 && (
        <div className="mt-8 space-y-6">
          {reviews.map((r) => {
            const isOwn = currentUser && r.user_id === currentUser.id;
            return (
              <article key={r.id} className="border-b border-neutral-200 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                      {(r.user?.name || 'A').charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{r.user?.name || 'Anonymous'}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={i < r.rating ? 'fill-current' : 'fill-neutral-200 text-neutral-200'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-400">{formatDate(r.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {isOwn && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingReview(r); setShowForm(false); setSubmitError(null); }}
                        className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-black"
                        disabled={submitting || deletingId === r.id}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-accent"
                        disabled={submitting || deletingId === r.id}
                      >
                        {deletingId === r.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{r.comment}</p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
