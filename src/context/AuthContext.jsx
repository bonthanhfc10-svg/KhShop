import { createContext, useContext, useMemo, useState } from 'react';
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

const mockAdmin = {
  id: 99,
  name: 'Bonthanh',
  email: 'bonthanhfc10@gmail.com',
  avatar: null,
  phone: '+1 555 000 0000',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get('user', null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        const u = {
          ...(isAdmin ? mockAdmin : mockUser),
          email: credentials.email,
        };
        storage.set('user', u);
        storage.set('token', 'mock-token');
        setUser(u);
        return u;
      }
      const data = await authService.login(credentials);
      storage.set('token', data.access_token || data.token);
      storage.set('user', data.user);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message =
        USE_MOCK && credentials.email && credentials.password
          ? 'Invalid email or password.'
          : err?.response?.data?.message || 'Login failed. Please try again.';
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
      storage.set('token', data.access_token || data.token);
      storage.set('user', data.user);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
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

  const updateUser = (data) => {
    setUser((prev) => {
      const next = { ...prev, ...data };
      storage.set('user', next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      loading,
      error,
      login,
      register,
      logout,
      forgotPassword,
      updateUser,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);