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

// Dựng URL đầy đủ tới weatherapi.com: tự gắn API key rồi thêm các tham số truyền vào.
const buildUrl = (endpoint, params) => {
  const url = new URL(`${API_CONFIG.BASE_URL}/${endpoint}`);
  url.searchParams.set('key', API_CONFIG.API_KEY);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, String(value));
  }
  return url.toString();
};

// Gọi API và trả JSON, gom toàn bộ xử lý lỗi vào một chỗ:
// - Lỗi mạng -> báo mất kết nối.
// - Lỗi từ server (res.ok = false) -> lấy message của weatherapi, hoặc mã lỗi HTTP.
const fetchJson = async (url) => {
  let res;
  try {
    res = await fetch(url);
  } catch (networkErr) {
    throw new Error('Không kết nối được tới máy chủ thời tiết. Kiểm tra mạng và thử lại.');
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // weatherapi trả { error: { code, message } }
    throw new Error(json?.error?.message || `Lỗi API (mã ${res.status}).`);
  }

  return json;
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

    // Đọc cache trước để tránh gọi lại API cho cùng thành phố.
    const cached = readCache(cacheKey);
    if (cached) return cached;

    const url = buildUrl('forecast.json', {
      q: query,
      days: API_CONFIG.FORECAST_DAYS,
      aqi: 'yes',
      alerts: 'yes',
      lang: API_CONFIG.LANG
    });

    const json = await fetchJson(url);
    writeCache(cacheKey, json);
    return json;
  },

  /**
   * Gợi ý địa điểm (autocomplete) — dùng cho ô tìm kiếm.
   * Lỗi được nuốt và trả [] để không làm vỡ UI khi đang gõ.
   * @param {string} term
   * @returns {Promise<Array>} danh sách địa điểm gợi ý
   */
  search: async (term) => {
    if (!API_CONFIG.API_KEY || !term) return [];

    // Bỏ dấu: search.json trả sai khi query có dấu tiếng Việt.
    const url = buildUrl('search.json', { q: removeDiacritics(term) });

    try {
      return await fetchJson(url);
    } catch {
      return [];
    }
  }
};
