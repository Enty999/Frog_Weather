// Comprehensive Mock Data for WeatherPulse App (Matching design screenshots)

export const MOCK_CITIES_WEATHER = {
  'Hà Nội': {
    name: 'Hà Nội',
    country: 'Việt Nam',
    temp: 32,
    feelsLike: 36,
    condition: 'Nhiều mây',
    icon: 'cloud-sun',
    humidity: 74,
    windSpeed: 12,
    windDirection: 'Đông Nam',
    pressure: 1008,
    uvIndex: 8.4,
    uvLevel: 'Rất cao',
    visibility: 10,
    dewPoint: 24,
    lat: 21.0285,
    lon: 105.8542
  },
  'TP. Hồ Chí Minh': {
    name: 'TP. Hồ Chí Minh',
    country: 'Việt Nam',
    temp: 28,
    feelsLike: 31,
    condition: 'Mưa rào nhẹ',
    icon: 'cloud-rain',
    humidity: 82,
    windSpeed: 10,
    windDirection: 'Tây Nam',
    pressure: 1010,
    uvIndex: 6.2,
    uvLevel: 'Trung bình',
    visibility: 9,
    lat: 10.8231,
    lon: 106.6297
  },
  'Đà Nẵng': {
    name: 'Đà Nẵng',
    country: 'Việt Nam',
    temp: 30,
    feelsLike: 33,
    condition: 'Nắng nhẹ',
    icon: 'sun',
    humidity: 70,
    windSpeed: 14,
    windDirection: 'Đông',
    pressure: 1011,
    uvIndex: 7.5,
    uvLevel: 'Cao',
    visibility: 10,
    lat: 16.0544,
    lon: 108.2022
  },
  'Tokyo': {
    name: 'Tokyo',
    country: 'Nhật Bản',
    temp: 15,
    feelsLike: 14,
    condition: 'Trời trong',
    icon: 'sun',
    humidity: 55,
    windSpeed: 8,
    lat: 35.6762,
    lon: 139.6503
  },
  'London': {
    name: 'London',
    country: 'Vương Quốc Anh',
    temp: 11,
    feelsLike: 9,
    condition: 'Mưa phùn',
    icon: 'cloud-drizzle',
    humidity: 88,
    windSpeed: 18,
    lat: 51.5074,
    lon: -0.1278
  },
  'New York': {
    name: 'New York',
    country: 'Mỹ',
    temp: 20,
    feelsLike: 20,
    condition: 'Nắng ấm',
    icon: 'sun',
    humidity: 60,
    windSpeed: 11,
    lat: 40.7128,
    lon: -74.0060
  }
};

export const MOCK_HOURLY_FORECAST = [
  { time: '09:00', temp: 30, condition: 'Nhiều mây', icon: 'cloud-sun', pop: 10 },
  { time: '11:00', temp: 32, condition: 'Nắng gián đoạn', icon: 'sun', pop: 20 },
  { time: '13:00', temp: 33, condition: 'Nhiều mây', icon: 'cloud', pop: 30 },
  { time: '15:00', temp: 32, condition: 'Mưa rào nhẹ', icon: 'cloud-rain', pop: 60 },
  { time: '17:00', temp: 30, condition: 'Mưa giông', icon: 'cloud-lightning-rain', pop: 80 },
  { time: '19:00', temp: 28, condition: 'Nhiều mây', icon: 'cloud', pop: 40 },
  { time: '21:00', temp: 27, condition: 'Trời mát', icon: 'moon-cloud', pop: 15 },
  { time: '23:00', temp: 26, condition: 'Trời trong', icon: 'moon', pop: 5 }
];

export const MOCK_7DAY_FORECAST = [
  { day: 'Thứ Hai', date: '28/07', tempMax: 32, tempMin: 24, condition: 'Nhiều mây', icon: 'cloud-sun', pop: 40 },
  { day: 'Thứ Ba', date: '29/07', tempMax: 33, tempMin: 25, condition: 'Nắng nóng', icon: 'sun', pop: 10 },
  { day: 'Thứ Tư', date: '30/07', tempMax: 31, tempMin: 24, condition: 'Mưa giông rải rác', icon: 'cloud-lightning-rain', pop: 75 },
  { day: 'Thứ Năm', date: '31/07', tempMax: 29, tempMin: 23, condition: 'Mưa rào nặng hạt', icon: 'cloud-heavy-rain', pop: 90 },
  { day: 'Thứ Sáu', date: '01/08', tempMax: 30, tempMin: 24, condition: 'Mây tản', icon: 'cloud-sun', pop: 30 },
  { day: 'Thứ Bảy', date: '02/08', tempMax: 32, tempMin: 25, condition: 'Trời nắng', icon: 'sun', pop: 15 },
  { day: 'Chủ Nhật', date: '03/08', tempMax: 33, tempMin: 26, condition: 'Nắng êm dịu', icon: 'sun', pop: 5 }
];

export const MOCK_AQI_HANOI = {
  city: 'Hà Nội, Việt Nam',
  score: 85,
  status: 'Trung bình',
  statusColor: '#f59e0b',
  pollutants: {
    pm25: { name: 'PM2.5', value: 35.4, unit: 'µg/m³', status: 'Vừa phải' },
    pm10: { name: 'PM10', value: 42.7, unit: 'µg/m³', status: 'Tốt' },
    so2: { name: 'SO₂', value: 12.8, unit: 'ppb', status: 'Tốt' },
    no2: { name: 'NO₂', value: 38.5, unit: 'ppb', status: 'Tốt' },
    o3: { name: 'O₃', value: 4.2, unit: 'ppb', status: 'Tốt' },
    co: { name: 'CO', value: 0.8, unit: 'ppm', status: 'Tốt' }
  },
  healthAdvice: [
    { target: 'Nhóm nhạy cảm (Trẻ em, người già, người bệnh hô hấp)', advice: 'Nên hạn chế các hoạt động thể lực kéo dài ngoài trời.', icon: 'shield-alert' },
    { target: 'Người bình thường', advice: 'Có thể tham gia các hoạt động ngoài trời bình thường, tuy nhiên nên đeo khẩu trang khi đi đường.', icon: 'check-circle' },
    { target: 'Tập luyện thể thao', advice: 'Giảm bớt cường độ chạy bộ hoặc tập luyện gần các tuyến đường giao thông đông đúc.', icon: 'activity' }
  ]
};

export const MOCK_TYPHOON_YAGI = {
  name: 'Siêu bão YAGI (Bão số 3)',
  level: 'Cấp 16 (Siêu bão khẩn cấp)',
  windSpeed: '184 - 201 km/h (Gió giật trên cấp 17)',
  location: '20.2°N - 108.5°E (Vịnh Bắc Bộ)',
  direction: 'Tây Tây Bắc',
  movingSpeed: '15 - 20 km/h',
  description: 'Bão số 3 (Siêu bão Yagi) sở hữu cường độ vô cùng lớn, nguy cơ gây lốc xoáy, mưa bão diện rộng, lũ quét và sạt lở đất nghiêm trọng tại các tỉnh Bắc Bộ.',
  hotlines: [
    { label: 'Cứu hộ Quốc gia', phone: '112' },
    { label: 'Cứu nạn & PCCC', phone: '114' },
    { label: 'Cấp cứu Y tế', phone: '115' }
  ],
  affectedAreas: [
    { province: 'Quảng Ninh', risk: 'Rất cao (Vùng tâm bão đi qua)' },
    { province: 'Hải Phòng', risk: 'Rất cao (Sóng biển 4-6m, gió giật mạnh)' },
    { province: 'Thái Bình & Nam Định', risk: 'Cao (Mưa to đến rất to)' },
    { province: 'Hà Nội & Các tỉnh trung du', risk: 'Cao (Ngập lụt đô thị & lốc xoáy)' }
  ],
  safetySteps: [
    'Chằng chống nhà cửa, gia cố mái tôn và chậu cây trên cao.',
    'Dự trữ lương thực, thực phẩm khô, nước uống và đèn pin chiếu sáng trong 3-5 ngày.',
    'Không đi ra ngoài khi bão đang đổ bộ trực tiếp.',
    'Theo dõi thường xuyên bản tin dự báo trên ứng dụng WeatherPulse.'
  ]
};
