import { useState, useEffect, useCallback } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAuth } from '../../../store/AuthContext';
import { authService } from '../../../services/authService';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchProfile = useCallback(async () => {
    setFetching(true);
    try {
      const profileData = await authService.getProfile();
      const profileUser = profileData.data || profileData?.user;
      if (profileUser) {
        updateUser({
          name: profileUser.name || '',
          email: profileUser.email || '',
          phone: profileUser.phone || '',
        });
        setForm({
          name: profileUser.name || '',
          email: profileUser.email || '',
          phone: profileUser.phone || '',
        });
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setFetching(false);
    }
  }, [updateUser, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErrors((e) => ({ ...e, [name]: undefined }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const res = await authService.updateProfile({
        name: form.name,
        phone: form.phone,
      });
      const updatedUser = res.data || res?.user;
      if (updatedUser) {
        updateUser({
          name: updatedUser.name || form.name,
          email: updatedUser.email || form.email,
          phone: updatedUser.phone || form.phone,
        });
      } else {
        updateUser({ name: form.name, phone: form.phone });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const fieldErrs = err?.response?.data?.errors;
      if (fieldErrs) {
        const mapped = {};
        Object.keys(fieldErrs).forEach((k) => {
          mapped[k] = fieldErrs[k][0];
        });
        setFieldErrors(mapped);
      } else {
        setError(err?.response?.data?.message || 'Failed to update profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <AccountLayout>
        <div className="border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-32 rounded bg-neutral-200" />
            <div className="h-10 w-full rounded bg-neutral-200" />
            <div className="h-4 w-32 rounded bg-neutral-200" />
            <div className="h-10 w-full rounded bg-neutral-200" />
            <div className="h-4 w-32 rounded bg-neutral-200" />
            <div className="h-10 w-full rounded bg-neutral-200" />
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <form onSubmit={handleSubmit} className="border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="label-kh">Full Name</label>
            <input
              id="name"
              className="input-kh"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-accent">{fieldErrors.name}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="label-kh">Email</label>
            <input
              id="email"
              type="email"
              className="input-kh"
              value={form.email}
              disabled
            />
            <p className="mt-1 text-xs text-neutral-400">Email cannot be changed.</p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="label-kh">Phone</label>
            <input
              id="phone"
              className="input-kh"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            {fieldErrors.phone && <p className="mt-1 text-xs text-accent">{fieldErrors.phone}</p>}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary mt-6 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : saved ? (
            <>
              <Check size={16} />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </AccountLayout>
  );
}
