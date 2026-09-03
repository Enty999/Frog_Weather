// App Entry Point
import { router } from './router/router.js';
import { themeService } from './services/themeService.js';
import { authService } from './services/authService.js';

// Initialize Theme, Auth session & SPA Router
document.addEventListener('DOMContentLoaded', async () => {
  themeService.init(); // Apply default light mode or saved theme

  // Khôi phục phiên đăng nhập Supabase vào localStorage trước khi render,
  // để Navbar và các auth-guard hiển thị đúng ngay lần vẽ đầu tiên (kể cả sau F5).
  await authService.init();

  router.init();        // Đăng ký listener hashchange
  router.handleRoute(); // Render trang hiện tại ngay sau khi đã có trạng thái đăng nhập
});
