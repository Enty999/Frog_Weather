// Ánh xạ dữ liệu JSON thô của weatherapi.com -> shape mà các page/section đang tiêu thụ.
// Toàn bộ là hàm thuần (pure), không gọi mạng.

const WEEKDAYS_VI = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

// La bàn 16 hướng -> tiếng Việt
const WIND_DIR_VI = {
  N: 'Bắc', NNE: 'Bắc Đông Bắc', NE: 'Đông Bắc', ENE: 'Đông Đông Bắc',
  E: 'Đông', ESE: 'Đông Đông Nam', SE: 'Đông Nam', SSE: 'Nam Đông Nam',
  S: 'Nam', SSW: 'Nam Tây Nam', SW: 'Tây Nam', WSW: 'Tây Tây Nam',
  W: 'Tây', WNW: 'Tây Tây Bắc', NW: 'Tây Bắc', NNW: 'Bắc Tây Bắc'
};

// Phân loại mã điều kiện weatherapi -> icon nội bộ (khớp getWeatherIconSvg)
const CODE_CLOUD = new Set([1006, 1009, 1030, 1135, 1147, 1012, 1015, 1018, 1021, 1024, 1027, 1033, 1036, 1039, 1042, 1045, 1048]);
const CODE_DRIZZLE = new Set([1063, 1150, 1153, 1168, 1171, 1180]);
const CODE_RAIN = new Set([1183, 1186, 1189, 1198, 1201, 1240, 1066, 1069, 1072]);
const CODE_HEAVY_RAIN = new Set([1192, 1195, 1243, 1246]);
const CODE_THUNDER = new Set([1087, 1273, 1276, 1279, 1282]);
// Tuyết/mưa đá: không có icon riêng -> dùng 'cloud'
const CODE_SNOW = new Set([1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264]);

const iconFromCode = (code, isDay = 1) => {
  const day = isDay === 1 || isDay === true;
  if (code === 1000) return day ? 'sun' : 'moon';           // Trời quang
  if (code === 1003) return day ? 'cloud-sun' : 'moon-cloud'; // Có mây rải rác
  if (CODE_THUNDER.has(code)) return 'cloud-lightning-rain';
  if (CODE_HEAVY_RAIN.has(code)) return 'cloud-heavy-rain';
  if (CODE_RAIN.has(code)) return 'cloud-rain';
  if (CODE_DRIZZLE.has(code)) return 'cloud-drizzle';
  if (CODE_CLOUD.has(code) || CODE_SNOW.has(code)) return 'cloud';
  return day ? 'cloud-sun' : 'moon-cloud'; // fallback an toàn
};

const uvLevelVi = (uv) => {
  if (uv == null) return '—';
  if (uv < 3) return 'Thấp';
  if (uv < 6) return 'Trung bình';
  if (uv < 8) return 'Cao';
  if (uv < 11) return 'Rất cao';
  return 'Nguy hiểm';
};

const windDirVi = (dir) => (dir ? (WIND_DIR_VI[dir] || dir) : '—');

const round = (n, digits = 0) => {
  if (n == null || Number.isNaN(Number(n))) return 0;
  const f = Math.pow(10, digits);
  return Math.round(Number(n) * f) / f;
};

const hhmm = (timeStr) => (typeof timeStr === 'string' ? timeStr.slice(-5) : '');

// ---- CURRENT ----
export const mapCurrent = (bundle, displayName) => {
  const loc = bundle?.location || {};
  const cur = bundle?.current || {};
  const cond = cur.condition || {};
  return {
    name: displayName || loc.name || '—',
    country: loc.country || '',
    temp: round(cur.temp_c),
    feelsLike: round(cur.feelslike_c),
    condition: cond.text || '—',
    icon: iconFromCode(cond.code, cur.is_day),
    humidity: round(cur.humidity),
    windSpeed: round(cur.wind_kph),
    windDirection: windDirVi(cur.wind_dir),
    pressure: round(cur.pressure_mb),
    uvIndex: round(cur.uv, 1),
    uvLevel: uvLevelVi(cur.uv),
    visibility: round(cur.vis_km),
    dewPoint: cur.dewpoint_c != null ? round(cur.dewpoint_c) : null,
    lat: loc.lat,
    lon: loc.lon
  };
};

// ---- HOURLY (24h tới, lấy mẫu ~3 giờ, tối đa 8 mốc) ----
export const mapHourly = (bundle) => {
  const days = bundle?.forecast?.forecastday || [];
  const nowEpoch = bundle?.location?.localtime_epoch || 0;

  // Gộp giờ của các ngày dự báo, chỉ giữ từ hiện tại trở đi
  const allHours = days.flatMap(d => d.hour || []);
  const upcoming = allHours.filter(h => (h.time_epoch || 0) >= nowEpoch);
  const source = upcoming.length ? upcoming : allHours;

  // Lấy mẫu mỗi 3 giờ, tối đa 8 mốc
  const sampled = source.filter((_, idx) => idx % 3 === 0).slice(0, 8);

  return sampled.map(h => ({
    time: hhmm(h.time),
    temp: round(h.temp_c),
    condition: h.condition?.text || '',
    icon: iconFromCode(h.condition?.code, h.is_day),
    pop: round(h.chance_of_rain)
  }));
};

// ---- DAILY ----
export const mapDaily = (bundle) => {
  const days = bundle?.forecast?.forecastday || [];
  return days.map(fd => {
    const d = fd.day || {};
    const cond = d.condition || {};
    // fd.date dạng 'YYYY-MM-DD'
    const dateObj = new Date(`${fd.date}T00:00:00`);
    const [yyyy, mm, dd] = (fd.date || '').split('-');
    return {
      day: WEEKDAYS_VI[dateObj.getDay()] || fd.date,
      date: mm && dd ? `${dd}/${mm}` : fd.date,
      tempMax: round(d.maxtemp_c),
      tempMin: round(d.mintemp_c),
      condition: cond.text || '',
      icon: iconFromCode(cond.code, 1),
      pop: round(d.daily_chance_of_rain)
    };
  });
};

// ---- AQI ----
// Bảng breakpoint US EPA cho PM2.5 (µg/m³) -> chỉ số AQI 0-500
const PM25_BREAKPOINTS = [
  { cLo: 0.0, cHi: 12.0, aLo: 0, aHi: 50 },
  { cLo: 12.1, cHi: 35.4, aLo: 51, aHi: 100 },
  { cLo: 35.5, cHi: 55.4, aLo: 101, aHi: 150 },
  { cLo: 55.5, cHi: 150.4, aLo: 151, aHi: 200 },
  { cLo: 150.5, cHi: 250.4, aLo: 201, aHi: 300 },
  { cLo: 250.5, cHi: 350.4, aLo: 301, aHi: 400 },
  { cLo: 350.5, cHi: 500.4, aLo: 401, aHi: 500 }
];

const pm25ToAqi = (pm25) => {
  if (pm25 == null) return null;
  const bp = PM25_BREAKPOINTS.find(b => pm25 <= b.cHi) || PM25_BREAKPOINTS[PM25_BREAKPOINTS.length - 1];
  const aqi = ((b => (b.aHi - b.aLo) / (b.cHi - b.cLo) * (Math.min(pm25, b.cHi) - b.cLo) + b.aLo)(bp));
  return Math.round(aqi);
};

// Chỉ số EPA (1-6) -> AQI đại diện khi thiếu pm2.5
const EPA_TO_AQI = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250, 6: 350 };

const aqiCategory = (aqi) => {
  if (aqi <= 50) return { status: 'Tốt', color: '#22c55e' };
  if (aqi <= 100) return { status: 'Trung bình', color: '#f59e0b' };
  if (aqi <= 150) return { status: 'Không tốt cho nhóm nhạy cảm', color: '#f97316' };
  if (aqi <= 200) return { status: 'Có hại cho sức khỏe', color: '#ef4444' };
  if (aqi <= 300) return { status: 'Rất có hại', color: '#a21caf' };
  return { status: 'Nguy hại', color: '#7f1d1d' };
};

const healthAdviceFor = (aqi) => {
  if (aqi <= 50) {
    return [
      { target: 'Người bình thường', advice: 'Không khí trong lành, thoải mái tham gia mọi hoạt động ngoài trời.', icon: 'check-circle' },
      { target: 'Nhóm nhạy cảm (Trẻ em, người già, người bệnh hô hấp)', advice: 'Có thể sinh hoạt bình thường, không cần biện pháp phòng ngừa đặc biệt.', icon: 'shield-check' },
      { target: 'Tập luyện thể thao', advice: 'Điều kiện lý tưởng để chạy bộ và luyện tập ngoài trời.', icon: 'activity' }
    ];
  }
  if (aqi <= 100) {
    return [
      { target: 'Người bình thường', advice: 'Có thể hoạt động ngoài trời bình thường, nên đeo khẩu trang khi đi đường đông.', icon: 'check-circle' },
      { target: 'Nhóm nhạy cảm (Trẻ em, người già, người bệnh hô hấp)', advice: 'Nên hạn chế các hoạt động thể lực kéo dài ngoài trời.', icon: 'shield-alert' },
      { target: 'Tập luyện thể thao', advice: 'Giảm bớt cường độ tập luyện gần các tuyến đường giao thông đông đúc.', icon: 'activity' }
    ];
  }
  if (aqi <= 150) {
    return [
      { target: 'Người bình thường', advice: 'Hạn chế hoạt động gắng sức kéo dài ngoài trời; đeo khẩu trang chống bụi mịn.', icon: 'shield-alert' },
      { target: 'Nhóm nhạy cảm (Trẻ em, người già, người bệnh hô hấp)', advice: 'Nên ở trong nhà và đóng cửa sổ; tránh ra ngoài nếu không cần thiết.', icon: 'exclamation-triangle' },
      { target: 'Tập luyện thể thao', advice: 'Chuyển hoạt động thể thao vào không gian trong nhà.', icon: 'activity' }
    ];
  }
  return [
    { target: 'Người bình thường', advice: 'Tránh mọi hoạt động ngoài trời; đeo khẩu trang N95 khi buộc phải ra ngoài.', icon: 'exclamation-octagon' },
    { target: 'Nhóm nhạy cảm (Trẻ em, người già, người bệnh hô hấp)', advice: 'Ở trong nhà, dùng máy lọc không khí; theo dõi sát triệu chứng hô hấp.', icon: 'exclamation-triangle' },
    { target: 'Tập luyện thể thao', advice: 'Ngừng toàn bộ hoạt động thể thao ngoài trời.', icon: 'x-octagon' }
  ];
};

export const mapAQI = (bundle, displayName) => {
  const loc = bundle?.location || {};
  const aq = bundle?.current?.air_quality || {};
  const pm25 = aq.pm2_5 != null ? aq.pm2_5 : null;

  let aqi = pm25 != null ? pm25ToAqi(pm25) : null;
  if (aqi == null) {
    const epa = aq['us-epa-index'];
    aqi = EPA_TO_AQI[epa] || 0;
  }
  const cat = aqiCategory(aqi);

  const cityLabel = [displayName || loc.name, loc.country].filter(Boolean).join(', ');

  const p = (name, value) => ({ name, value: round(value, 1), unit: 'µg/m³', status: cat.status });

  return {
    city: cityLabel || '—',
    score: aqi,
    status: cat.status,
    statusColor: cat.color,
    pollutants: {
      pm25: p('PM2.5', aq.pm2_5),
      pm10: p('PM10', aq.pm10),
      so2: p('SO₂', aq.so2),
      no2: p('NO₂', aq.no2),
      o3: p('O₃', aq.o3),
      co: p('CO', aq.co)
    },
    healthAdvice: healthAdviceFor(aqi)
  };
};

// ---- ALERTS ----
const formatAlertTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const severityToLevel = (severity) => {
  const s = (severity || '').toLowerCase();
  return s === 'extreme' || s === 'severe' ? 'danger' : 'warning';
};

const severityLabelVi = (severity) => {
  const map = { extreme: 'Cực kỳ nguy hiểm', severe: 'Nghiêm trọng', moderate: 'Trung bình', minor: 'Nhẹ' };
  return map[(severity || '').toLowerCase()] || 'Cảnh báo';
};

export const mapAlerts = (bundle) => {
  const list = bundle?.alerts?.alert || [];
  return list.map((a, idx) => ({
    id: `alert-${idx}`,
    title: a.headline || a.event || 'Cảnh báo thời tiết',
    severity: severityToLevel(a.severity),
    level: a.event || severityLabelVi(a.severity),
    time: a.effective ? `Hiệu lực từ ${formatAlertTime(a.effective)}` : '',
    affectedArea: a.areas || 'Chưa xác định',
    link: '#/typhoon'
  }));
};

// Trả về object cảnh báo bão/nguy hiểm chi tiết, hoặc null nếu không có.
const STORM_KEYWORDS = /storm|typhoon|hurricane|cyclone|wind|gale|bão|gió|lốc/i;

export const mapTyphoon = (bundle) => {
  const list = bundle?.alerts?.alert || [];
  if (!list.length) return null;

  // Ưu tiên cảnh báo liên quan bão/gió, nếu không lấy cảnh báo đầu tiên
  const a = list.find(x => STORM_KEYWORDS.test(`${x.event || ''} ${x.headline || ''} ${x.category || ''}`)) || list[0];

  return {
    name: a.headline || a.event || 'Cảnh báo thời tiết nguy hiểm',
    event: a.event || '',
    severity: severityToLevel(a.severity),
    severityLabel: severityLabelVi(a.severity),
    urgency: a.urgency || '',
    certainty: a.certainty || '',
    category: a.category || '',
    areas: a.areas || 'Chưa xác định',
    effective: formatAlertTime(a.effective),
    expires: formatAlertTime(a.expires),
    desc: a.desc || '',
    instruction: a.instruction || ''
  };
};
