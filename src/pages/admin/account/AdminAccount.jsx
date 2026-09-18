import { useState, useEffect, useCallback } from 'react';
import { User, Shield, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { adminAccountService } from '../../../services/admin/adminAccountService';
import AdminLoading from '../../../components/common/Loading';

const inputCls =
  'w-full rounded-lg border border-gray-300 bg-admin-card-elevated px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#25A9EB] focus:ring-2 focus:ring-[#25A9EB]/15';
const labelCls = 'mb-1.5 block text-sm font-medium text-neutral-700';

export default function AdminAccount() {
  const { admin, updateUser } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile state
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordGeneralError, setPasswordGeneralError] = useState(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAccountService.getProfile();
      setProfile(data);
      setProfileForm({
        name: data?.name || '',
        email: data?.email || '',
        phone: data?.phone || '',
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setProfileErrors((prev) => ({ ...prev, [field]: undefined }));
    setProfileSuccess(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileErrors({});
    setProfileSuccess(false);
    try {
      const updated = await adminAccountService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
      });
      setProfile(updated);
      setProfileSuccess(true);
      // Sync with AuthContext so sidebar/header updates immediately
      updateUser({ name: updated.name, phone: updated.phone });
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        setProfileErrors(err.response.data.errors);
      } else {
        setProfileErrors({ general: err?.response?.data?.message || 'Failed to update profile.' });
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
    setPasswordGeneralError(null);
    setPasswordSuccess(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordErrors({});
    setPasswordGeneralError(null);
    setPasswordSuccess(false);

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordErrors({ new_password_confirmation: ['Passwords do not match.'] });
      setChangingPassword(false);
      return;
    }

    try {
      await adminAccountService.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      });
      setPasswordSuccess(true);
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        setPasswordErrors(err.response.data.errors);
      } else {
        setPasswordGeneralError(err?.response?.data?.message || 'Failed to change password.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <AdminLoading />;

  if (error) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button onClick={loadProfile} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const roleName = profile?.role?.name || admin?.role || 'Admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account information and security</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Profile Information */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-admin-border bg-admin-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
                <User size={20} className="text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
                <p className="text-sm text-slate-500">Update your personal details</p>
              </div>
            </div>

            {profileSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle size={16} />
                Profile updated successfully.
              </div>
            )}

            {profileErrors.general && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={16} />
                {profileErrors.general}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className={inputCls}
                  required
                />
                {profileErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{profileErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  className={`${inputCls} cursor-not-allowed bg-gray-50`}
                  disabled
                />
                <p className="mt-1 text-xs text-slate-400">Email cannot be changed from here.</p>
              </div>

              <div>
                <label className={labelCls}>Phone</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className={inputCls}
                  placeholder="Enter phone number"
                />
                {profileErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{profileErrors.phone[0]}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25A9EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e96d4] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar: Role Info */}
        <div className="xl:col-span-1">
          <div className="rounded-xl border border-admin-border bg-admin-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                <Shield size={20} className="text-violet-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Role</h2>
                <p className="text-sm text-slate-500">Your account permissions</p>
              </div>
            </div>

            <div className="rounded-lg border border-admin-border-subtle bg-admin-surface-subtle px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Shield size={15} className="text-violet-500" />
                {roleName}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>
                <span className="font-medium text-slate-700">Name:</span>{' '}
                {profile?.name || admin?.name}
              </p>
              <p>
                <span className="font-medium text-slate-700">Email:</span>{' '}
                {profile?.email || admin?.email}
              </p>
              {profile?.phone && (
                <p>
                  <span className="font-medium text-slate-700">Phone:</span> {profile.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-admin-border bg-admin-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <Shield size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Security</h2>
            <p className="text-sm text-slate-500">Change your password to keep your account secure</p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle size={16} />
            Password changed successfully.
          </div>
        )}

        {passwordGeneralError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} />
            {passwordGeneralError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="max-w-lg space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => handlePasswordChange('current_password', e.target.value)}
              className={inputCls}
              required
              autoComplete="current-password"
            />
            {passwordErrors.current_password && (
              <p className="mt-1 text-xs text-red-600">{passwordErrors.current_password[0]}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>New Password</label>
            <input
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => handlePasswordChange('new_password', e.target.value)}
              className={inputCls}
              required
              minLength={8}
              autoComplete="new-password"
            />
            {passwordErrors.new_password && (
              <p className="mt-1 text-xs text-red-600">{passwordErrors.new_password[0]}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.new_password_confirmation}
              onChange={(e) => handlePasswordChange('new_password_confirmation', e.target.value)}
              className={inputCls}
              required
              minLength={8}
              autoComplete="new-password"
            />
            {passwordErrors.new_password_confirmation && (
              <p className="mt-1 text-xs text-red-600">{passwordErrors.new_password_confirmation[0]}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changingPassword ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
