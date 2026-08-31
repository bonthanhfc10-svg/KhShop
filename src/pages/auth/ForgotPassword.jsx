import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/common/AuthLayout';
import { validateForgotPassword } from '../../utils/validation';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
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
      const res = await forgotPassword(email);
      setMessage(res?.message || 'Check your email for a reset link.');
      setEmail('');
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="font-semibold text-black underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <label htmlFor="email" className="label-kh">Email</label>
          <input
            id="email"
            type="email"
            className="input-kh"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-accent">{errors.email}</p>}
        </div>

        {message && (
          <p className="mb-4 rounded border border-green-600/30 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
            {message}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>
    </AuthLayout>
  );
}
