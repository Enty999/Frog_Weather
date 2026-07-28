// Auth Service — xác thực với tài khoản demo (phía client)
import { DEMO_ACCOUNTS } from '../config/constants.js';
import { storageService } from './storageService.js';

export const authService = {
  // Đăng nhập: khớp email (không phân biệt hoa thường) + mật khẩu
  login: (email, password) => {
    const normalized = (email || '').trim().toLowerCase();
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === normalized && acc.password === password
    );

    if (!account) {
      return { ok: false, error: 'Email hoặc mật khẩu không đúng.' };
    }

    storageService.setUser({ email: account.email, name: account.name });
    return { ok: true };
  },

  // Đã đăng nhập chưa
  isAuthenticated: () => !!storageService.getUser()
};
