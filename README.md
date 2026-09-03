# 🌤️ WeatherPulse — Ứng dụng Dự báo Thời tiết & Cảnh báo Thiên tai Thông minh

<!-- <p align="center">
  <img src="./assets/banner.png" alt="WeatherPulse Banner" width="100%" />
</p> -->

## 📌 Giới thiệu sản phẩm

**WeatherPulse** là nền tảng theo dõi thời tiết và cảnh báo thiên tai toàn diện, được thiết kế hiện đại, trực quan và tối ưu cho người dùng Việt Nam. Không chỉ cung cấp dữ liệu thời tiết thời gian thực với độ chính xác cao, WeatherPulse còn tích hợp các hệ thống **Cảnh báo siêu bão khẩn cấp**, **Đánh giá chỉ số chất lượng không khí (AQI)** và **Bản đồ trực quan dạng Rada** giúp bạn luôn chủ động trước mọi diễn biến của thời tiết.

> ⚡ _Khám phá thời tiết thế giới với sự chính xác tuyệt đối và trải nghiệm giao diện mượt mà trên mọi thiết bị._

## 🔥 Tính năng nổi bật

### 1. 🌡️ Dự báo thời tiết Thời gian thực & 24h / 7 ngày

- Cập nhật chính xác nhiệt độ, độ ẩm, áp suất khí quyển, tốc độ gió và chỉ số UV.
- Biểu đồ dự báo nhiệt độ chi tiết theo từng giờ trong ngày và xu hướng 7 ngày tới.

### 2. 🚨 Cảnh báo Thiên tai Khẩn cấp & Theo dõi Siêu bão

- Tích hợp hệ thống theo dõi bão (như Siêu bão Yagi / Bão số 3) với bản đồ di chuyển thời gian thực.
- Cung cấp danh mục **Hành động Khẩn cấp**, danh sách **Khu vực chịu ảnh hưởng** và số điện thoại cứu hộ nhanh.

### 3. 🌬️ Phân tích Chỉ số Chất lượng Không khí (AQI)

- Đo lường chi tiết chỉ số AQI cùng các nồng độ chất ô nhiễm: **PM2.5, PM10, SO₂, NO₂, O₃, CO**.
- Đưa ra các **Lời khuyên sức khỏe** trực quan phù hợp cho từng nhóm đối tượng (người nhạy cảm, trẻ em, người tập thể thao ngoài trời).

### 4. 🗺️ Bản đồ Nhiệt & Rada Mây Mưa tương tác

- Theo dõi chuyển động của mây, lượng mưa và nhiệt độ trên bản đồ trực quan.

### 5. ⭐️ Quản lý Địa điểm Yêu thích (theo tài khoản)

- Lưu nhanh các thành phố thường xuyên theo dõi (Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Tokyo, New York, v.v.).
- Danh sách yêu thích được lưu **theo từng tài khoản trên Supabase** — đăng nhập ở bất kỳ thiết bị nào cũng thấy đúng danh sách của bạn (đồng bộ đa thiết bị).
- Chuyển đổi và so sánh thời tiết giữa các khu vực dễ dàng chỉ với một cú nhấp chuột.

### 6. 🔐 Đăng ký & Đăng nhập

- Tạo tài khoản thật bằng **email + mật khẩu** (xác thực qua **Supabase Auth**).
- Đăng nhập để mở khóa và đồng bộ danh sách địa điểm yêu thích của riêng bạn.

---

## 🛠️ Công nghệ sử dụng

| Hạng mục      | Công nghệ                                                        |
| ------------- | ---------------------------------------------------------------- |
| Ngôn ngữ      | Vanilla JavaScript (ES Modules) — không dùng framework           |
| Bundler       | Vite                                                             |
| Giao diện     | Bootstrap 5 + CSS tùy biến (glassmorphism, dark/light)          |
| Biểu đồ / Bản đồ | Chart.js, Leaflet.js                                          |
| Dữ liệu thời tiết | [WeatherAPI.com](https://www.weatherapi.com/)                |
| Xác thực & DB | [Supabase](https://supabase.com/) (Auth + Postgres cho favorites) |

> 📖 Muốn hiểu sâu kiến trúc, luồng dữ liệu và vai trò từng file? Xem **[README.local.md](./README.local.md)** — tài liệu kỹ thuật nội bộ.

## 🚀 Bắt đầu nhanh

```bash
# 1. Cài đặt & tạo file cấu hình
cp .env.example .env

# 2. Điền vào .env:
#    VITE_WEATHER_API_KEY   → lấy tại https://www.weatherapi.com/
#    VITE_SUPABASE_URL      → Supabase: Settings → API
#    VITE_SUPABASE_ANON_KEY → Supabase: Settings → API

# 3. Trên Supabase: tắt "Confirm email" (Authentication → Providers → Email)
#    và chạy SQL tạo bảng favorites (xem README.local.md, mục Supabase)

# 4. Chạy dev server
npm run dev
```

---

<p align="center">
  Made with ❤️ by <b>WeatherPulse Team</b>
</p>
