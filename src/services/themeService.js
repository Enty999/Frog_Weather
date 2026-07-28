// Theme Service for Managing Light / Dark Mode (Default: Light)

const THEME_KEY = 'weatherpulse_theme';

export const themeService = {
  getTheme: () => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved ? saved : 'light'; // Default is light
    } catch {
      return 'light';
    }
  },

  setTheme: (theme) => {
    const validTheme = (theme === 'dark') ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, validTheme);
    document.documentElement.setAttribute('data-theme', validTheme);
    document.documentElement.setAttribute('data-bs-theme', validTheme);
    return validTheme;
  },

  toggleTheme: () => {
    const current = themeService.getTheme();
    const nextTheme = (current === 'light') ? 'dark' : 'light';
    return themeService.setTheme(nextTheme);
  },

  init: () => {
    const current = themeService.getTheme();
    themeService.setTheme(current);
  }
};
