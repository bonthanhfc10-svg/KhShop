import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saved, setSaved] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const profileData = await authService.getProfile();
      const profileUser = profileData.data || profileData?.user;
      if (profileUser) {
        updateUser(profileUser);
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
    }
  }, [updateUser, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ name: form.name, phone: form.phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

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
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="label-kh">Email</label>
            <input
              id="email"
              type="email"
              className="input-kh"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="label-kh">Phone</label>
            <input
              id="phone"
              className="input-kh"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-6 flex items-center gap-2">
          {saved && <Check size={16} />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </form>
    </AccountLayout>
  );
}
