import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { USE_MOCK } from '../../services/config';
import { adminApi } from '../services/adminApi';

const AdminAuthContext = createContext(null);

const ADMIN_STORAGE_KEY = 'khshop_admin';

const mockAdmin = {
  id: 99,
  name: 'Bonthanh',
  email: 'bonthanhfc10@gmail.com',
  role: 'admin',
  avatar: null,
};

const loadStoredAdmin = () => {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(loadStoredAdmin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        if (email === 'bonthanhfc10@gmail.com' && password === '2222') {
          const a = { ...mockAdmin, email };
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(a));
          localStorage.setItem('khshop_admin_token', 'mock-admin-token');
          setAdmin(a);
          return a;
        }
        const message = 'Invalid admin credentials.';
        setError(message);
        throw new Error(message);
      }
      const { data } = await adminApi.post('/admin/login', { email, password });
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data.user || data.admin));
      localStorage.setItem('khshop_admin_token', data.access_token || data.token);
      setAdmin(data.user || data.admin);
      return data;
    } catch (err) {
      const message =
        USE_MOCK ? error : err?.response?.data?.message || 'Login failed.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [error]);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem('khshop_admin_token');
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      loading,
      error,
      login,
      logout,
    }),
    [admin, loading, error, login, logout]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
