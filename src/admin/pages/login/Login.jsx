import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function Login() {
  const { login, loading, error } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch {
      // error shown from context
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Left brand panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-neutral-900 p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <Zap size={22} className="text-neutral-900" />
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-tight text-white">
              KHShop<span className="text-accent">.</span>
            </p>
            <p className="text-xs uppercase tracking-widest text-neutral-400">Admin Panel</p>
          </div>
        </Link>

        <div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white">
            Manage your entire
            <br />
            e-commerce store.
          </h1>
          <p className="mt-4 max-w-md text-neutral-400">
            Products, orders, customers, inventory and reports — all in one
            professional dashboard.
          </p>
        </div>

        <p className="text-sm text-neutral-500">
          © 2026 KHShop. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> Back to store
          </Link>

          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900">
              <Zap size={22} className="text-white" />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight text-neutral-900">
                KHShop<span className="text-accent">.</span>
              </p>
              <p className="text-xs uppercase tracking-widest text-neutral-400">Admin Panel</p>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-neutral-900">Admin Login</h2>
          <p className="mt-1.5 text-sm text-neutral-500">
            Sign in to access the admin dashboard.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-all focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-10 text-sm outline-none transition-all focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-neutral-900"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
            <p className="font-semibold text-neutral-700">Demo credentials:</p>
            <p className="mt-1">
              Email: <code className="text-neutral-900">bonthanhfc10@gmail.com</code>
              <br />
              Password: <code className="text-neutral-900">2222</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
