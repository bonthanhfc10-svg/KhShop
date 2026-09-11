const USERS_KEY = 'khshop_users';

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

const DEFAULT_ADMIN = {
  id: 1,
  name: 'Admin',
  email: 'admin@khshop.com',
  role: 'admin',
  avatar: '/images/default-avatar.svg',
};

const DEFAULT_CUSTOMER = {
  id: 100,
  name: 'Customer',
  email: 'customer@khshop.com',
  role: 'customer',
  avatar: '/images/default-avatar.svg',
};

export const authService = {
  async login({ email, password }) {
    await delay();
    const users = getUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      const { password: _, ...user } = found;
      const token = 'mock_token_' + Date.now();
      return { data: { user, token } };
    }

    if (email === 'admin@khshop.com' && password === 'password') {
      const user = { ...DEFAULT_ADMIN };
      const token = 'mock_token_admin_' + Date.now();
      return { data: { user, token } };
    }

    if (email === 'customer@khshop.com' && password === 'password') {
      const user = { ...DEFAULT_CUSTOMER };
      const token = 'mock_token_' + Date.now();
      return { data: { user, token } };
    }

    throw { response: { data: { message: 'Invalid email or password.' } } };
  },

  async register({ name, email, password }) {
    await delay();
    const users = getUsers();

    if (users.some((u) => u.email === email)) {
      throw { response: { data: { message: 'Email already registered.' } } };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'customer',
      avatar: '/images/default-avatar.svg',
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...user } = newUser;
    return { data: { user } };
  },

  async forgotPassword() {
    await delay();
    return { data: { message: 'Reset link sent to your email.' } };
  },

  async verifyEmail() {
    await delay();
    return { data: { message: 'Email verified.' } };
  },

  async resendVerificationOtp() {
    await delay();
    return { data: { message: 'OTP resent.' } };
  },

  async verifyResetOtp() {
    await delay();
    return { data: { message: 'OTP verified.' } };
  },

  async resendResetOtp() {
    await delay();
    return { data: { message: 'OTP resent.' } };
  },

  async resetPassword() {
    await delay();
    return { data: { message: 'Password reset successfully.' } };
  },

  async getProfile() {
    await delay();
    try {
      const raw = localStorage.getItem('user');
      if (raw) return { data: { user: JSON.parse(raw) } };
    } catch { /* ignore */ }
    return { data: { user: DEFAULT_CUSTOMER } };
  },

  async logout() {
    await delay(50);
    return { data: { message: 'Logged out.' } };
  },
};

export default authService;
