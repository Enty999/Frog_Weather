// Favorites Service — lưu địa điểm yêu thích theo tài khoản trên Supabase.
// Dùng một cache đồng bộ trong bộ nhớ để UI (WeatherCard.render) đọc nhanh mà không
// phải await, trong khi mọi thao tác ghi (thêm/xóa) đi qua Supabase.
import { supabase } from './supabaseClient.js';
import { storageService } from './storageService.js';

// Danh sách tên thành phố yêu thích của user đang đăng nhập (cache trong RAM)
let cache = [];

// Lấy user_id hiện tại từ user object đã mirror vào localStorage (do authService set)
const currentUserId = () => storageService.getUser()?.id || null;

// Chuyển lỗi lưu dữ liệu thành thông báo có thể hiển thị trực tiếp cho người dùng.
const favoriteError = (error) => {
  if (error.code === '23505') {
    return new Error('Không thể thêm địa điểm do dữ liệu bị trùng. Vui lòng tải lại trang; nếu vẫn lỗi, hãy liên hệ người quản trị.');
  }
  if (error.code === '42501' || error.code === 'PGRST301') {
    return new Error('Không có quyền cập nhật yêu thích. Vui lòng đăng nhập lại rồi thử lại.');
  }
  return new Error('Không lưu được thay đổi yêu thích. Vui lòng kiểm tra kết nối và thử lại.');
};

export const favoritesService = {
  // Nạp danh sách yêu thích từ Supabase vào cache. Gọi khi khởi động app & khi đổi phiên.
  load: async () => {
    const uid = currentUserId();
    if (!uid) {
      cache = [];
      return cache;
    }
    const { data, error } = await supabase
      .from('favorites')
      .select('city')
      .eq('user_id', uid);

    cache = (!error && Array.isArray(data)) ? data.map(row => row.city) : [];
    return cache;
  },

  // Xóa cache (dùng khi đăng xuất)
  clear: () => {
    cache = [];
  },

  // Đọc đồng bộ từ cache (cho favoritesPage & WeatherCard render)
  getFavorites: () => [...cache],
  isFavorite: (city) => cache.includes(city),

  // Thêm/bỏ yêu thích cho user hiện tại. Trả về trạng thái MỚI (true = đang yêu thích).
  toggleFavorite: async (city) => {
    const uid = currentUserId();
    if (!uid) throw new Error('Vui lòng đăng nhập để lưu địa điểm yêu thích.');
    if (typeof city !== 'string' || !city.trim()) {
      throw new Error('Tên địa điểm không hợp lệ. Vui lòng chọn lại địa điểm.');
    }

    try {
      if (cache.includes(city)) {
        // Chỉ bỏ khỏi cache khi máy chủ xác nhận đã xóa bản ghi của tài khoản này.
        const { data, error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', uid)
          .eq('city', city)
          .select('city');
        if (error) throw error;
        if (!data?.length) throw new Error('Không có bản ghi được xóa.');
        if (currentUserId() === uid) cache = cache.filter(c => c !== city);
        return false;
      }

      // Thêm một dòng mới, giữ nguyên các thành phố đã lưu trước đó.
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: uid, city });
      if (error) throw error;
      if (currentUserId() === uid && !cache.includes(city)) cache.push(city);
      return true;
    } catch (error) {
      throw favoriteError(error);
    }
  }
};
