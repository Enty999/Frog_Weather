// Supabase Client — khởi tạo kết nối tới Supabase Auth (nạp SDK qua CDN ESM)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Đọc cấu hình từ biến môi trường Vite (.env). Bắt buộc có tiền tố VITE_ để lộ ra client.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Thông báo lỗi hiển thị cho người dùng khi chưa cấu hình Supabase
const NOT_CONFIGURED_MSG =
  'Chưa cấu hình Supabase. Vui lòng điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env.';

// Query builder giả: hỗ trợ chuỗi .select()/.insert()/.delete()/.eq() và await được,
// luôn trả về danh sách rỗng kèm lỗi "chưa cấu hình".
const createStubQuery = () => {
  const result = { data: [], error: { message: NOT_CONFIGURED_MSG } };
  const builder = {
    select: () => builder,
    insert: () => builder,
    delete: () => builder,
    eq: () => builder,
    then: (resolve) => resolve(result) // để `await` hoạt động
  };
  return builder;
};

// Stub thay thế khi thiếu cấu hình: giữ cho app (các trang không cần đăng nhập) vẫn
// chạy bình thường thay vì sập ngay lúc nạp module do createClient ném lỗi với URL rỗng.
const createStub = () => ({
  auth: {
    signInWithPassword: async () => ({ data: null, error: { message: NOT_CONFIGURED_MSG } }),
    signUp: async () => ({ data: null, error: { message: NOT_CONFIGURED_MSG } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null } }),
    getUser: async () => ({ data: { user: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => createStubQuery()
});

if (!isConfigured) {
  console.error(
    '[Supabase] Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong .env — ' +
    'chức năng đăng nhập/đăng ký sẽ không hoạt động.'
  );
}

// Instance dùng chung cho toàn app. Supabase tự lưu & khôi phục phiên trong localStorage.
export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createStub();
