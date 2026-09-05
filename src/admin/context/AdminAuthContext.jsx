import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { storage } from '../../utils/storage';
import { authService } from '../../services/authService';
import { USE_MOCK } from '../../services/config';
import { useAuth } from '../../context/AuthContext';

const AdminAuthContext = createContext(null);

const mockAdmin = {
  id: 99,
  name: 'Bonthanh',
  email: 'bonthanhfc10@gmail.com',
  role: 'admin',
  avatar: null,
};

const loadStoredAdmin = () => {
  try {
    return storage.get('user', null);
  } catch {
    return null;
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(loadStoredAdmin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateUser } = useAuth();

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        if (email === 'bonthanhfc10@gmail.com' && password === '2222') {
          const a = { ...mockAdmin, email };
          storage.set('user', a);
          storage.set('token', 'mock-admin-token');
          setAdmin(a);
          updateUser(a);
          return a;
        }
        const message = 'Invalid email or password.';
        setError(message);
        throw new Error(message);
      }
      const { data } = await authService.login({ email, password });
      const user = data.data?.user || data.user || null;

      if (user?.role !== 'admin' && user?.role !== 'superAdmin') {
        const message = 'Invalid email or password.';
        setError(message);
        throw new Error(message);
      }

      storage.set('user', user);
      storage.set('token', data.data?.token);
      setAdmin(user);
      updateUser(user);
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        (USE_MOCK ? 'Invalid email or password.' : 'Login failed.');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  const logout = useCallback(() => {
    storage.remove('user');
    storage.remove('token');
    setAdmin(null);
    updateUser(null);
  }, [updateUser]);

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      isAdmin: admin?.role === 'admin' || admin?.role === 'superAdmin',
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
