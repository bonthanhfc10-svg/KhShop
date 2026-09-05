import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';
import { USE_MOCK } from '../services/config';

const AuthContext = createContext(null);

const mockUser = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: null,
  phone: '+1 555 010 2030',
  role: 'user',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get('user', null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handler = () => {
      setUser(null);
      storage.remove('user');
      storage.remove('token');
    };
    window.addEventListener('auth:401', handler);
    return () => window.removeEventListener('auth:401', handler);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        const isAdmin =
          (credentials.email === 'bonthanhfc10@gmail.com' &&
            credentials.password === '2222') ||
          credentials.email === 'admin@khshop.com' ||
          credentials.email === 'admin';
        if (isAdmin) {
          const message = 'Invalid email or password.';
          setError(message);
          throw new Error(message);
        }
        const u = { ...mockUser, email: credentials.email };
        storage.set('user', u);
        storage.set('token', 'mock-token');
        setUser(u);
        return u;
      }
      const data = await authService.login(credentials);
      const user = data.data?.user || data.user || null;

      if (user?.role === 'admin' || user?.role === 'superAdmin') {
        const message = 'Invalid email or password.';
        setError(message);
        throw new Error(message);
      }

      const token = data.data.token || data.token || data.access_token;
      storage.set('token', token);

      storage.set('user', user);
      setUser(user);
      return user;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        (USE_MOCK ? 'Invalid email or password.' : 'Login failed. Please try again.');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        const u = { ...mockUser, name: payload.name, email: payload.email };
        storage.set('user', u);
        storage.set('token', 'mock-token');
        setUser(u);
        return u;
      }
      const data = await authService.register(payload);
      return data.data.user;
    } catch (err) {
      const hasFieldErrors = err?.response?.data?.errors;
      if (!hasFieldErrors) {
        const message = err?.response?.data?.message || 'Registration failed. Please try again.';
        setError(message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        return { message: 'If that email exists, a reset link has been sent.' };
      }
      return await authService.forgotPassword(email);
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storage.remove('user');
    storage.remove('token');
    setUser(null);
    if (!USE_MOCK) {
      authService.logout().catch(() => {});
    }
  };

  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const next = { ...prev, ...data };
      storage.set('user', next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin' || user?.role === 'superAdmin',
      loading,
      error,
      login,
      register,
      logout,
      forgotPassword,
      updateUser,
    }),
    [user, loading, error, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);