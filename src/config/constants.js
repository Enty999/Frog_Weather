// System Constants & Route Enums for WeatherPulse
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DETAIL: '/detail',
  FAVORITES: '/favorites',
  ALERTS: '/alerts',
  TYPHOON: '/typhoon',
  FORECAST: '/forecast',
  AQI: '/aqi'
};

export const APP_CONFIG = {
  NAME: 'WeatherPulse',
  VERSION: '1.0.0',
  DEFAULT_CITY: 'Hà Nội'
};

// Tài khoản demo (xác thực phía client — chỉ dùng cho mục đích demo)
export const DEMO_ACCOUNTS = [
  { email: 'admin@weatherpulse.com', password: 'admin123', name: 'Quản trị viên' },
  { email: 'user@weatherpulse.com', password: 'user123', name: 'Người dùng' },
  { email: 'demo@weatherpulse.com', password: 'demo123', name: 'Khách Demo' }
];

// Cấu hình kết nối WeatherAPI.com
export const API_CONFIG = {
  BASE_URL: 'https://api.weatherapi.com/v1',
  API_KEY: import.meta.env.VITE_WEATHER_API_KEY,
  LANG: 'vi', // Lấy mô tả điều kiện thời tiết bằng tiếng Việt
  FORECAST_DAYS: 3 // Gói free tối đa 3 ngày; nâng gói chỉ cần đổi số này
};

// Ánh xạ tên thành phố tiếng Việt -> TỌA ĐỘ "lat,lon" gửi cho weatherapi.
// Dùng tọa độ để chính xác tuyệt đối: weatherapi đặt tên sai/nhiễu cho vài TP VN
// (vd query "Da Nang" trỏ nhầm ~17.8,105.9; "Hue" ra sân bay ở Ethiopia).
// Nhãn hiển thị vẫn là tên tiếng Việt (mapCurrent dùng displayName), không lộ tọa độ.
// Tên KHÔNG có trong bảng này sẽ được bỏ dấu (removeDiacritics) rồi gửi thẳng.
export const CITY_QUERY_MAP = {
  'Hà Nội': '21.0285,105.8542',
  'TP. Hồ Chí Minh': '10.8231,106.6297',
  'Hồ Chí Minh': '10.8231,106.6297',
  'TP.HCM': '10.8231,106.6297',
  'Sài Gòn': '10.8231,106.6297',
  'Đà Nẵng': '16.0544,108.2022',
  'Hải Phòng': '20.8449,106.6881',
  'Cần Thơ': '10.0452,105.7469',
  'Huế': '16.4637,107.5909',
  'Nha Trang': '12.2388,109.1967'
};

// Bỏ dấu tiếng Việt (weatherapi trả sai vị trí khi query có dấu; bản không dấu luôn đúng)
export const removeDiacritics = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // xóa các dấu thanh/mũ tổ hợp
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim();
};

// Chuyển tên thành phố hiển thị -> chuỗi query gửi lên API
export const toApiQuery = (cityName) => {
  if (!cityName) return CITY_QUERY_MAP[APP_CONFIG.DEFAULT_CITY];
  // Ưu tiên bảng map chuẩn; còn lại bỏ dấu để API giải đúng vị trí
  return CITY_QUERY_MAP[cityName] || removeDiacritics(cityName);
};

// Map NGƯỢC: tên chuẩn weatherapi trả về -> danh tính tiếng Việt của app.
// Mục đích: khi tìm kiếm ra 1 TP đã biết, quy về CÙNG danh tính với thẻ trang chủ
// để tránh trùng lặp trong Yêu thích (vd "Ho Chi Minh City" == "TP. Hồ Chí Minh").
// Bonus: "Da Nang" (search trả sai tọa độ) -> "Đà Nẵng" -> đi qua tọa độ chuẩn.
export const CANONICAL_ALIASES = {
  'Ha Noi': 'Hà Nội',
  'Hanoi': 'Hà Nội',
  'Ho Chi Minh City': 'TP. Hồ Chí Minh',
  'Saigon': 'TP. Hồ Chí Minh',
  'Da Nang': 'Đà Nẵng',
  'Danang': 'Đà Nẵng',
  'Hai Phong': 'Hải Phòng',
  'Can Tho': 'Cần Thơ',
  'Nha Trang': 'Nha Trang'
};

// Chuẩn hóa tên hiển thị/danh tính từ kết quả tìm kiếm
export const toDisplayName = (apiName) => CANONICAL_ALIASES[apiName] || apiName;
