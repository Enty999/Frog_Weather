// Storage Service for LocalStorage (Favorites & Auth state)

const FAVORITES_KEY = 'weatherpulse_favorites';
const AUTH_KEY = 'weatherpulse_auth';
const LAST_CITY_KEY = 'weatherpulse_last_city';

export const storageService = {
  getFavorites: () => {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Tokyo'];
    } catch {
      return ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Tokyo'];
    }
  },

  toggleFavorite: (cityName) => {
    const favorites = storageService.getFavorites();
    let updated;
    if (favorites.includes(cityName)) {
      updated = favorites.filter(c => c !== cityName);
    } else {
      updated = [...favorites, cityName];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  },

  isFavorite: (cityName) => {
    const favorites = storageService.getFavorites();
    return favorites.includes(cityName);
  },

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
