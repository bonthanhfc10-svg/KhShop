import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateRegister } from '../../utils/validation';
import AuthLayout from '../../components/common/AuthLayout';

export default function Register() {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (name, value) =>
    setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateRegister(values);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate('/account');
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join KhShop to start shopping."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-black underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="name" className="label-kh">Full Name</label>
          <input
            id="name"
            className="input-kh"
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Alex Johnson"
          />
          {errors.name && <p className="mt-1 text-xs text-accent">{errors.name}</p>}
        </div>

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
          <label htmlFor="password" className="label-kh">Password</label>
          <input
            id="password"
            type="password"
            className="input-kh"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Minimum 6 characters"
          />
          {errors.password && <p className="mt-1 text-xs text-accent">{errors.password}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="label-kh">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="input-kh"
            value={values.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-accent">{errors.confirmPassword}</p>
          )}
        </div>

        {error && (
          <p className="mb-4 rounded border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
}
