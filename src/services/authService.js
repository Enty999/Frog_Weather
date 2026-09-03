// Auth Service — xác thực bằng Supabase Auth.
// Vẫn mirror thông tin user vào localStorage (qua storageService) để Navbar và các
// auth-guard hiện có (đọc storageService.getUser() đồng bộ) tiếp tục hoạt động.
import { supabase } from './supabaseClient.js';
import { storageService } from './storageService.js';
import { favoritesService } from './favoritesService.js';

// Suy ra tên hiển thị từ email (phần trước dấu @) — khớp cách Navbar đang hiển thị
const nameFromEmail = (email) => (email || '').split('@')[0];

// Ánh xạ thông báo lỗi tiếng Anh của Supabase sang tiếng Việt cho người dùng cuối
const translateError = (message) => {
  const msg = (message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email hoặc mật khẩu không đúng.';
  if (msg.includes('user already registered')) return 'Email này đã được đăng ký.';
  if (msg.includes('password should be at least')) return 'Mật khẩu phải có ít nhất 6 ký tự.';
  if (msg.includes('unable to validate email address') || msg.includes('invalid email')) {
    return 'Địa chỉ email không hợp lệ.';
  }
  if (msg.includes('email rate limit') || msg.includes('rate limit')) {
    return 'Thao tác quá nhanh, vui lòng thử lại sau ít phút.';
  }
  return message || 'Đã có lỗi xảy ra, vui lòng thử lại.';
};

export const authService = {
  // Đăng nhập bằng email + mật khẩu
  login: async (email, password) => {
    const normalized = (email || '').trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password
    });

    if (error) {
      return { ok: false, error: translateError(error.message) };
    }

    const userEmail = data?.user?.email || normalized;
    storageService.setUser({ id: data?.user?.id, email: userEmail, name: nameFromEmail(userEmail) });
    return { ok: true };
  },

  // Đăng ký tài khoản mới. Do đã tắt "Confirm email" nên Supabase trả session ngay,
  // người dùng đăng nhập được luôn.
  register: async (email, password) => {
    const normalized = (email || '').trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalized,
      password
    });

    if (error) {
      return { ok: false, error: translateError(error.message) };
    }

    // Nếu vì lý do nào đó xác minh email vẫn bật (không có session), báo cho người dùng
    if (!data?.session) {
      return {
        ok: false,
        error: 'Tài khoản đã tạo nhưng cần xác minh email trước khi đăng nhập.'
      };
    }

    const userEmail = data?.user?.email || normalized;
    storageService.setUser({ id: data?.user?.id, email: userEmail, name: nameFromEmail(userEmail) });
    return { ok: true };
  },

  // Đăng xuất khỏi cả phiên Supabase lẫn localStorage
  logout: async () => {
    await supabase.auth.signOut();
    storageService.logout();
    favoritesService.clear();
  },

  // Khôi phục phiên khi tải trang: đồng bộ session Supabase -> localStorage.
  // Gọi 1 lần lúc khởi động app (main.js) trước khi render router.
  init: async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user?.email) {
      const { id, email } = data.session.user;
      storageService.setUser({ id, email, name: nameFromEmail(email) });
      await favoritesService.load(); // nạp danh sách yêu thích của user vào cache
    } else {
      storageService.logout();
      favoritesService.clear();
    }

    // Giữ localStorage & cache favorites đồng bộ với mọi thay đổi trạng thái đăng nhập
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        const { id, email } = session.user;
        storageService.setUser({ id, email, name: nameFromEmail(email) });
        favoritesService.load();
      } else {
        storageService.logout();
        favoritesService.clear();
      }
    });
  },

  // Đã đăng nhập chưa (đồng bộ — các trang khác dùng pattern này để guard)
  isAuthenticated: () => !!storageService.getUser()
};
