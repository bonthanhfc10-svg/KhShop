import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/common/AuthLayout';
import { validateForgotPassword } from '../../utils/validation';
import { authService } from '../../services/authService';
import { Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateForgotPassword({ email });
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    try {
      await authService.forgotPassword(email);
      navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage('');
      setErrors({ api: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email and we&apos;ll send you a 6-digit OTP to reset your password."
      footer={
        <Link to="/login" className="font-semibold text-black underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="label-kh">Email</label>
          <input
            id="email"
            type="email"
            className="input-kh"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-accent">{errors.email}</p>}
          {errors.api && <p className="mt-1 text-xs text-red-600">{errors.api}</p>}
        </div>

        {message && (
          <p className="mb-4 rounded border border-green-600/30 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
            {message}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Sending…
            </span>
          ) : (
            'Send OTP'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
