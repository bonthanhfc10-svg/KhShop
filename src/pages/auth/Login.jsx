import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateLogin } from '../../utils/validation';
import AuthLayout from '../../components/common/AuthLayout';

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (name, value) =>
    setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateLogin(values);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    try {
      await login({ email: values.email, password: values.password });
      navigate('/account');
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back. Sign in to continue."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-black underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="label-kh">Email</label>
          <input
            id="email"
            type="email"
            className="input-kh"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-accent">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label-kh">Password</label>
            <Link to="/forgot-password" className="mb-2 text-xs font-semibold text-neutral-500 hover:text-black">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            className="input-kh"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Your password"
          />
          {errors.password && <p className="mt-1 text-xs text-accent">{errors.password}</p>}
        </div>

        {error && (
          <p className="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent" role="alert">
            {error}
          </p>
        )}

        <label className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={values.remember}
            onChange={(e) => handleChange('remember', e.target.checked)}
            className="h-4 w-4 accent-black"
          />
          Remember me
        </label>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
}
