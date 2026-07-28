// Tầng gọi API weatherapi.com + cache trong bộ nhớ
import { API_CONFIG, toApiQuery, removeDiacritics } from '../config/constants.js';

// Cache đơn giản theo query, TTL 5 phút.
// Mục tiêu: nhiều section trong cùng 1 trang gọi cùng thành phố -> chỉ 1 request thật.
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

const readCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const writeCache = (key, data) => {
  cache.set(key, { data, time: Date.now() });
};

export const apiClient = {
  /**
   * Lấy "bundle" đầy đủ cho 1 thành phố trong MỘT request:
   * current + forecast (theo ngày & theo giờ) + air_quality + alerts.
   * @param {string} cityName Tên thành phố (hiển thị, tiếng Việt hoặc bất kỳ)
   * @returns {Promise<Object>} JSON thô từ weatherapi.com
   */
  getBundle: async (cityName) => {
    if (!API_CONFIG.API_KEY) {
      throw new Error('Thiếu API key. Hãy tạo file .env với biến VITE_WEATHER_API_KEY.');
    }

    const query = toApiQuery(cityName);
    const cacheKey = `bundle:${query}`;

    const cached = readCache(cacheKey);
    if (cached) return cached;

    const url = new URL(`${API_CONFIG.BASE_URL}/forecast.json`);
    url.searchParams.set('key', API_CONFIG.API_KEY);
    url.searchParams.set('q', query);
    url.searchParams.set('days', String(API_CONFIG.FORECAST_DAYS));
    url.searchParams.set('aqi', 'yes');
    url.searchParams.set('alerts', 'yes');
    url.searchParams.set('lang', API_CONFIG.LANG);

    let res;
    try {
      res = await fetch(url.toString());
    } catch (networkErr) {
      throw new Error('Không kết nối được tới máy chủ thời tiết. Kiểm tra mạng và thử lại.');
    }

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      // weatherapi trả { error: { code, message } }
      const message = json?.error?.message || `Lỗi API (mã ${res.status}).`;
      throw new Error(message);
    }

    writeCache(cacheKey, json);
    return json;
  },

  /**
   * Gợi ý địa điểm (autocomplete) — dùng cho ô tìm kiếm nếu cần.
   * @param {string} term
   * @returns {Promise<Array>} danh sách địa điểm gợi ý
   */
  search: async (term) => {
    if (!API_CONFIG.API_KEY || !term) return [];
    const url = new URL(`${API_CONFIG.BASE_URL}/search.json`);
    url.searchParams.set('key', API_CONFIG.API_KEY);
    // Bỏ dấu: search.json cũng trả sai khi query có dấu tiếng Việt
    url.searchParams.set('q', removeDiacritics(term));
    try {
      const res = await fetch(url.toString());
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // Xóa cache (dùng khi cần làm mới thủ công)
  clearCache: () => cache.clear()
};
