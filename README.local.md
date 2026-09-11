# WeatherPulse — Tài liệu kỹ thuật

Tài liệu mô tả cấu trúc, luồng xử lý và cách chạy dự án Frog_Weather.

## 1. Công nghệ và cấu trúc

| Thành phần | Công nghệ |
| --- | --- |
| Giao diện | HTML, CSS, Bootstrap 5, Bootstrap Icons |
| Xử lý | JavaScript ES Modules |
| Chạy và đóng gói | Vite |
| Biểu đồ | Chart.js |
| Bản đồ | Leaflet và nền bản đồ OpenStreetMap |
| Dữ liệu thời tiết | WeatherAPI |
| Tài khoản và địa điểm yêu thích | Supabase Auth và PostgreSQL |

```text
Frog_Weather/
├── index.html           # Khung HTML, nạp thư viện và main.js
├── package.json         # Các lệnh dev, build, preview
├── .env.example         # Mẫu biến cấu hình
├── src/
│   ├── main.js          # Khởi tạo giao diện, phiên đăng nhập và router
│   ├── config/          # Đường dẫn, cấu hình API và ánh xạ tên thành phố
│   ├── router/          # Điều hướng theo URL hash
│   ├── services/        # API, dữ liệu, xác thực, yêu thích và lưu trữ
│   ├── components/      # Các thành phần giao diện dùng chung
│   ├── pages/           # Các trang và thành phần riêng của từng trang
│   └── utils/           # Định dạng nhiệt độ và chọn biểu tượng thời tiết
└── assets/css/
    ├── main.css         # Nạp các file CSS
    ├── base.css         # Kiểu chung và giao diện sáng/tối
    ├── components/      # CSS của thành phần dùng chung
    └── pages/           # CSS riêng từng trang
```

## 2. Luồng xử lý

### Khởi động và điều hướng

1. `index.html` nạp `src/main.js` bằng `type="module"`.
2. `main.js` khởi tạo giao diện sáng/tối và chờ `authService.init()` khôi phục phiên đăng nhập, nạp danh sách yêu thích nếu có tài khoản.
3. Router đọc URL hash, chọn trang và hiển thị trạng thái đang tải.
4. `page.render(params)` lấy dữ liệu và trả chuỗi HTML để chèn vào `#app`.
5. `page.afterRender(params)` gắn sự kiện, khởi tạo biểu đồ và bản đồ. Router hiển thị thông báo nếu quá trình tải trang gặp lỗi.

| Đường dẫn | Trang |
| --- | --- |
| `#/` | Trang chủ và tìm kiếm thành phố |
| `#/detail?city=Hà Nội` | Chi tiết thời tiết |
| `#/forecast?city=Hà Nội` | Dự báo nhiều ngày |
| `#/aqi?city=Hà Nội` | Chất lượng không khí |
| `#/alerts` | Danh sách cảnh báo |
| `#/typhoon` | Chi tiết cảnh báo bão |
| `#/favorites` | Địa điểm yêu thích |
| `#/login` | Đăng nhập |
| `#/register` | Đăng ký |

### Dữ liệu thời tiết

`Trang → weatherService / alertService → apiClient → WeatherAPI → weatherMapper → giao diện`.

- `apiClient.js` gọi Fetch API, xử lý lỗi và dùng `Map` lưu kết quả theo thành phố trong 5 phút. Các lần gọi sau dùng lại kết quả còn hạn.
- `weatherMapper.js` chuyển JSON thành dữ liệu hiển thị cho thời tiết, dự báo, AQI và cảnh báo; dùng `Set` để phân loại mã thời tiết.
- `constants.js` chứa `ROUTES`, `APP_CONFIG`, `API_CONFIG` và các hàm xử lý tên thành phố. `toDisplayName()` chuẩn hóa tên hiển thị; `toApiQuery()` tra tọa độ hoặc bỏ dấu tên trước khi gọi API.
- Ô tìm kiếm chờ 300ms sau khi nhập rồi gọi API gợi ý; hiển thị tối đa 6 kết quả. Khi chọn địa điểm, ứng dụng chuyển đến trang chi tiết.
- `FORECAST_DAYS` hiện được đặt là `3`. Số ngày hiển thị phụ thuộc dữ liệu API trả về, dù một số hàm và file còn có tên `7Day` hoặc `7Days`.

### Tài khoản và yêu thích

- `authService.js` xử lý đăng ký, đăng nhập, đăng xuất và khôi phục phiên bằng Supabase Auth.
- `storageService.js` lưu thông tin người dùng và thành phố xem gần nhất trong LocalStorage. `themeService.js` lưu lựa chọn giao diện sáng/tối.
- `favoritesService.js` đọc và ghi bảng `favorites` theo `user_id`; giữ danh sách trong bộ nhớ để vẽ trạng thái sao.
- Mỗi tài khoản được lưu nhiều thành phố. Cặp `(user_id, city)` phải duy nhất để tránh lưu trùng một thành phố trong cùng tài khoản.
- Chưa đăng nhập thì bấm sao sẽ chuyển đến trang đăng nhập. Khi lưu, nút tạm khóa; thành công mới cập nhật sao hoặc gỡ thẻ, thất bại sẽ hiện thông báo trên thẻ.
- Trang yêu thích dùng `Promise.allSettled()` để tải thời tiết của các thành phố đã lưu.

## 3. Thành phần giao diện và class ES6

| Thành phần | Vai trò |
| --- | --- |
| `Navbar` | Điều hướng, đổi giao diện, menu tài khoản và đăng xuất. Trên điện thoại, tài khoản nằm ở hàng trên bên phải. |
| `Footer` | Chân trang dùng chung |
| `WeatherCard` | Class hiển thị thẻ thời tiết đầy đủ và xử lý nút yêu thích |
| `CompactWeatherCard` | Class con hiển thị thẻ thời tiết rút gọn |
| `ForecastChart` | Hiển thị dữ liệu theo giờ và vẽ biểu đồ nhiệt độ |
| `AQIGauge` | Hiển thị chỉ số AQI |
| `AlertCard` | Hiển thị nội dung cảnh báo |

### Kế thừa và ghi đè phương thức

- [WeatherCard.js](src/components/WeatherCard.js) khai báo class cha. Constructor lưu `weatherData` và tùy chọn tương tác; `render()` tạo thẻ đầy đủ.
- [CompactWeatherCard.js](src/components/CompactWeatherCard.js) khai báo `class CompactWeatherCard extends WeatherCard`.
- Constructor của class con gọi `super(weatherData, options)` để khởi tạo dữ liệu chung.
- Class con ghi đè `render()` để tạo bố cục rút gọn, đồng thời kế thừa `getRenderData()` từ class cha.
- `WeatherCard` được dùng tại phần thời tiết hiện tại, trang chi tiết và trang yêu thích. `CompactWeatherCard` được dùng tại mục Thành phố nổi tiếng.
- `WeatherCard.afterRender()` là phương thức tĩnh gắn sự kiện sau khi chèn HTML; `handleFavoriteClick()` xử lý thao tác yêu thích dùng chung.

Ví dụ với `data` là kết quả lấy từ service:

```js
import { WeatherCard } from './src/components/WeatherCard.js';
import { CompactWeatherCard } from './src/components/CompactWeatherCard.js';

const fullCard = new WeatherCard(data);
const compactCard = new CompactWeatherCard(data, { interactive: false });

// Cùng phương thức render(), mỗi class tạo bố cục riêng.
const fullHtml = fullCard.render();
const compactHtml = compactCard.render();
```

Hai class này là minh chứng cho yêu cầu có ít nhất hai class ES6, sử dụng kế thừa, `super()` và ghi đè phương thức.

## 4. Cấu hình và chạy dự án

### Biến môi trường

Trong thư mục dự án, tạo `.env` từ mẫu nếu chưa có:

```bash
cp .env.example .env
```

Điền ba biến:

| Biến | Nội dung |
| --- | --- |
| `VITE_WEATHER_API_KEY` | Khóa WeatherAPI |
| `VITE_SUPABASE_URL` | URL dự án Supabase |
| `VITE_SUPABASE_ANON_KEY` | Khóa công khai của Supabase |

### Supabase

Ứng dụng sử dụng email và mật khẩu để tạo tài khoản. Luồng đăng ký hiện xử lý đăng nhập ngay khi Supabase trả session; nếu bật xác minh email, ứng dụng thông báo cần xác minh trước khi đăng nhập.

Với dự án Supabase mới, chạy đoạn SQL sau trong SQL Editor để tạo bảng và quyền truy cập theo tài khoản:

```sql
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  city       text not null,
  created_at timestamptz not null default now(),
  unique (user_id, city)
);

alter table public.favorites enable row level security;

create policy "Người dùng đọc favorites của mình"
  on public.favorites for select using (auth.uid() = user_id);
create policy "Người dùng thêm favorites của mình"
  on public.favorites for insert with check (auth.uid() = user_id);
create policy "Người dùng xóa favorites của mình"
  on public.favorites for delete using (auth.uid() = user_id);
```

Nếu bảng đã tồn tại, kiểm tra cấu trúc và các policy trước khi chạy. `CREATE TABLE IF NOT EXISTS` không cập nhật bảng cũ. Không đặt `unique` trên riêng `user_id`, vì điều đó giới hạn mỗi tài khoản chỉ lưu được một thành phố.

### Các lệnh chạy

Cần Node.js và pnpm. Các script hiện dùng `npx -y vite`, vì vậy lần chạy có thể cần tải Vite từ npm.

```bash
pnpm run dev
pnpm run build
pnpm run preview
```

Mở địa chỉ mà terminal hiển thị sau khi chạy `dev` hoặc `preview`. Lệnh `build` tạo thư mục `dist/`. Khi thay đổi `.env`, khởi động lại máy chủ phát triển.
