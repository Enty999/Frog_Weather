// Favorites Service — lưu địa điểm yêu thích theo tài khoản trên Supabase.
// Dùng một cache đồng bộ trong bộ nhớ để UI (WeatherCard.render) đọc nhanh mà không
// phải await, trong khi mọi thao tác ghi (thêm/xóa) đi qua Supabase.
import { supabase } from './supabaseClient.js';
import { storageService } from './storageService.js';

// Danh sách tên thành phố yêu thích của user đang đăng nhập (cache trong RAM)
let cache = [];

// Lấy user_id hiện tại từ user object đã mirror vào localStorage (do authService set)
const currentUserId = () => storageService.getUser()?.id || null;

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
    if (!uid) return cache.includes(city); // chưa đăng nhập -> không đổi

    if (cache.includes(city)) {
      // Đang yêu thích -> xóa khỏi Supabase rồi khỏi cache
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', uid)
        .eq('city', city);
      if (!error) cache = cache.filter(c => c !== city);
    } else {
      // Chưa yêu thích -> thêm vào Supabase rồi vào cache
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: uid, city });
      if (!error) cache.push(city);
    }

    return cache.includes(city);
  }
};
