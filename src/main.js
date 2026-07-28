// App Entry Point
import { router } from './router/router.js';
import { themeService } from './services/themeService.js';

// Initialize Theme & SPA Router
document.addEventListener('DOMContentLoaded', () => {
  themeService.init(); // Apply default light mode or saved theme
  router.init();
});
