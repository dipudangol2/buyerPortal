const TOKEN_KEY = 'token';
const EXPIRY_DAYS = 3;

interface StoredToken {
  value: string;
  expiry: number;
}

export const authStorage = {
  setToken: (token: string) => {
    const expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const item: StoredToken = {
      value: token,
      expiry,
    };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(item));
  },

  getToken: (): string | null => {
    const itemStr = localStorage.getItem(TOKEN_KEY);
    if (!itemStr) return null;

    try {
      const item: StoredToken = JSON.parse(itemStr);
      
      if (!item.expiry) {
          localStorage.removeItem(TOKEN_KEY);
          return null;
      }

      if (Date.now() > item.expiry) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      return item.value;
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  }
};
