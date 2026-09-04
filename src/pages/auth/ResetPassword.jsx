import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { validateResetPassword } from '../../utils/validation';
import { authService } from '../../services/authService';
import AuthLayout from '../../components/common/AuthLayout';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = storage.get('khshop_reset_email', '');
  const otp = storage.get('khshop_reset_otp', '');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateResetPassword({ password, confirmPassword });
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp,
        password,
        password_confirm: confirmPassword,
      });
      storage.remove('khshop_reset_email');
      storage.remove('khshop_reset_otp');
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Password reset failed. Please try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Password Reset!" subtitle="Your password has been updated successfully.">
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <Lock className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="heading-display text-2xl text-neutral-900">Done!</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Redirecting to login…
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter a new password for your account."
      footer={
        <Link to="/login" className="font-semibold text-black underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {serverError && (
          <p className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {serverError}
          </p>
        )}

        {email && (
          <div className="mb-4 flex items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            <Mail size={16} className="shrink-0 text-neutral-500" />
            <span className="truncate">{email}</span>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="password" className="label-kh">New Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="input-kh pr-10"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-accent">{errors.password}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="label-kh">Confirm Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="input-kh pr-10"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-accent">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Resetting…
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
