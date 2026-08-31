const PREFIX = 'khshop_';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
  clear() {
    try {
      const keys = Object.keys(window.localStorage).filter((k) =>
        k.startsWith(PREFIX)
      );
      keys.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  },
};

export default storage;
