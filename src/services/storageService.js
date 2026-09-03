// Storage Service for LocalStorage (Auth state & last city)
// Lưu ý: địa điểm yêu thích nay lưu theo tài khoản trên Supabase (xem favoritesService.js).

const AUTH_KEY = 'weatherpulse_auth';
const LAST_CITY_KEY = 'weatherpulse_last_city';

export const storageService = {
  getUser: () => {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser: (userData) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Thành phố người dùng xem gần nhất (để các link Navbar bám theo)
  getLastCity: () => {
    try {
      return localStorage.getItem(LAST_CITY_KEY) || null;
    } catch {
      return null;
    }
  },

  setLastCity: (cityName) => {
    if (cityName) localStorage.setItem(LAST_CITY_KEY, cityName);
  }
};
