# 📘 WeatherPulse — Tài liệu Kỹ thuật Nội bộ (Local Developer Guide)

> **Mục đích**: Giúp các thành viên trong nhóm hiểu rõ **cấu trúc dự án**, **luồng dữ liệu end-to-end**, và **vai trò/nhiệm vụ** của từng file trong codebase.

---

## 📑 Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Cây thư mục dự án](#2-cây-thư-mục-dự-án)
3. [Luồng dữ liệu (Data Flow)](#3-luồng-dữ-liệu-data-flow)
4. [Chi tiết từng file & nhiệm vụ](#4-chi-tiết-từng-file--nhiệm-vụ)
   - 4.1 [Entry Point & Cấu hình](#41-entry-point--cấu-hình)
   - 4.2 [Router (SPA Hash Router)](#42-router-spa-hash-router)
   - 4.3 [Services (Tầng dữ liệu)](#43-services-tầng-dữ-liệu)
   - 4.4 [Components (UI tái sử dụng)](#44-components-ui-tái-sử-dụng)
   - 4.5 [Pages (Trang chức năng)](#45-pages-trang-chức-năng)
   - 4.6 [Utils (Tiện ích)](#46-utils-tiện-ích)
   - 4.7 [Config (Hằng số & Cấu hình)](#47-config-hằng-số--cấu-hình)
   - 4.8 [Assets (CSS, Icons, Images)](#48-assets-css-icons-images)
5. [Sơ đồ kiến trúc tổng thể](#5-sơ-đồ-kiến-trúc-tổng-thể)
6. [Quy ước & Pattern quan trọng](#6-quy-ước--pattern-quan-trọng)
7. [API & Nguồn dữ liệu bên ngoài](#7-api--nguồn-dữ-liệu-bên-ngoài)
8. [Hướng dẫn chạy dự án](#8-hướng-dẫn-chạy-dự-án)

---

## 1. Tổng quan kiến trúc

| Đặc điểm        | Giá trị                                                               |
| ---------------- | --------------------------------------------------------------------- |
| **Framework**    | Vanilla JavaScript (ES Modules) — Không React, Vue hay Angular        |
| **Bundler**      | Vite (dev server + production build)                                  |
| **CSS**          | Bootstrap 5.3.3 + Custom CSS (Glassmorphism, dark/light theme)        |
| **Icons**        | Bootstrap Icons + Lucide Icons                                        |
| **Charts**       | Chart.js (biểu đồ nhiệt độ)                                          |
| **Maps**         | Leaflet.js (bản đồ radar, heatmap, theo dõi bão)                     |
| **Routing**      | SPA Hash Router tự xây (`#/path?param=value`)                        |
| **API**          | [WeatherAPI.com](https://www.weatherapi.com/) — Forecast + AQI + Alerts |
| **State**        | LocalStorage (auth mirror, theme, last city) + cache RAM (favorites) |
| **Auth**         | **Supabase Auth** (email + mật khẩu, đăng ký/đăng nhập thật)          |
| **Database**     | **Supabase Postgres** — bảng `favorites` (RLS theo `user_id`)        |
| **Language**     | Giao diện hoàn toàn tiếng Việt, dữ liệu API trả bằng `lang=vi`      |

---

## 2. Cây thư mục dự án

```
Frog_Weather/
├── index.html                      # HTML duy nhất (SPA entry), load CDN + main.js
├── package.json                    # Metadata dự án, scripts: dev/build/preview
├── .env                            # Bí mật: VITE_WEATHER_API_KEY + VITE_SUPABASE_* — KHÔNG commit
├── .env.example                    # Mẫu .env cho người mới (weather + supabase)
├── .gitignore
│
├── src/                            # ═══ SOURCE CODE CHÍNH ═══
│   ├── main.js                     # Entry point JS: init theme + router
│   │
│   ├── config/
│   │   └── constants.js            # Routes (9), API config, city mappings (KHÔNG còn demo accounts)
│   │
│   ├── router/
│   │   └── router.js               # SPA hash router: điều hướng, loading spinner, error
│   │
│   ├── services/                   # ═══ TẦNG DỮ LIỆU (DATA LAYER) ═══
│   │   ├── apiClient.js            # Gọi weatherapi.com + in-memory cache (TTL 5 phút)
│   │   ├── weatherService.js       # Facade: current, hourly, daily, AQI
│   │   ├── weatherMapper.js        # Ánh xạ JSON thô → shape UI (pure functions)
│   │   ├── alertService.js         # Cảnh báo bão/thiên tai (alerts, typhoon)
│   │   ├── supabaseClient.js       # Khởi tạo Supabase client (CDN ESM) + stub khi thiếu env
│   │   ├── authService.js          # Xác thực Supabase (register/login/logout/init) + map lỗi VI
│   │   ├── favoritesService.js     # Yêu thích theo tài khoản trên Supabase + cache RAM đồng bộ
│   │   ├── storageService.js       # Quản lý LocalStorage (auth mirror, last city)
│   │   └── themeService.js         # Quản lý dark/light mode (LocalStorage + data-theme)
│   │
│   ├── components/                 # ═══ UI COMPONENTS TÁI SỬ DỤNG ═══
│   │   ├── Navbar.js               # Thanh điều hướng (dynamic active route, theme toggle)
│   │   ├── Footer.js               # Footer toàn ứng dụng
│   │   ├── WeatherCard.js          # Thẻ thời tiết (compact/full, yêu thích, click→detail)
│   │   ├── ForecastChart.js        # Biểu đồ nhiệt độ Chart.js + danh sách hourly
│   │   ├── AQIGauge.js             # Đồng hồ hiển thị chỉ số AQI
│   │   └── AlertCard.js            # Thẻ cảnh báo thiên tai (danger/warning badge)
│   │
│   ├── pages/                      # ═══ CÁC TRANG (MỖI TRANG = 1 THƯ MỤC) ═══
│   │   ├── homePage/               # Trang chủ
│   │   │   ├── homePage.js         #   Container chính: lắp ghép sections
│   │   │   ├── HomeHeroSection.js  #   Hero banner + search bar + autocomplete
│   │   │   ├── HomeCurrentSection.js #  Thời tiết hiện tại (default city)
│   │   │   └── HomeSuggestedSection.js # Gợi ý thành phố khác
│   │   │
│   │   ├── detailPage/             # Chi tiết thời tiết 1 thành phố
│   │   │   ├── detailPage.js       #   Container: nhận ?city= param
│   │   │   ├── DetailHeaderSection.js #  Header: tên TP + nhiệt độ lớn
│   │   │   ├── Detail24hSection.js #   Dự báo 24h theo giờ (strip ngang)
│   │   │   ├── DetailMetricsSection.js # Bảng chỉ số chi tiết (6 metric cards)
│   │   │   └── DetailRadarSection.js # Bản đồ Leaflet radar mây/mưa
│   │   │
│   │   ├── forecastPage/           # Dự báo nhiều ngày
│   │   │   ├── forecastPage.js     #   Container
│   │   │   ├── ForecastChartSection.js # Biểu đồ đường nhiệt độ max/min
│   │   │   └── Forecast7DaysListSection.js # Danh sách dự báo dạng list
│   │   │
│   │   ├── aqiPage/                # Chất lượng không khí
│   │   │   ├── aqiPage.js          #   Container
│   │   │   ├── AQIGaugeSection.js  #   Đồng hồ AQI lớn
│   │   │   ├── AQIPollutantsSection.js # 6 thẻ chất ô nhiễm (PM2.5, PM10, ...)
│   │   │   └── AQIHealthAdviceSection.js # Lời khuyên sức khỏe theo nhóm
│   │   │
│   │   ├── alertsPage/             # Cảnh báo & bản đồ
│   │   │   ├── alertsPage.js       #   Container
│   │   │   ├── AlertsHeatmapSection.js # Bản đồ heatmap Leaflet
│   │   │   └── AlertsListSection.js #  Danh sách cảnh báo đang có hiệu lực
│   │   │
│   │   ├── typhoonDetailPage/      # Chi tiết bão / cảnh báo khẩn cấp
│   │   │   ├── typhoonDetailPage.js #  Container (empty state nếu không có bão)
│   │   │   ├── TyphoonBannerSection.js # Banner đỏ cảnh báo
│   │   │   ├── TyphoonTrackerSection.js # Bản đồ theo dõi bão Leaflet
│   │   │   ├── TyphoonActionsSection.js # Hành động khẩn cấp + hotline
│   │   │   └── TyphoonAffectedAreasSection.js # Bảng khu vực chịu ảnh hưởng
│   │   │
│   │   ├── loginPage/              # Đăng nhập
│   │   │   └── loginPage.js        #   Form + ẩn/hiện mật khẩu + link sang đăng ký
│   │   │
│   │   ├── registerPage/           # Đăng ký tài khoản mới
│   │   │   └── registerPage.js     #   Email + mật khẩu + xác nhận (ẩn/hiện riêng từng ô)
│   │   │
│   │   └── favoritesPage/          # Địa điểm yêu thích (yêu cầu đăng nhập)
│   │       └── favoritesPage.js    #   Grid thẻ thời tiết + toggle yêu thích (Supabase)
│   │
│   └── utils/
│       └── formatters.js           # formatTemp(), getWeatherIconSvg()
│
└── assets/                         # ═══ STATIC ASSETS ═══
    ├── css/
    │   ├── main.css                # Master: @import tất cả file CSS con
    │   ├── base.css                # CSS gốc: CSS variables, theme, typography, glassmorphism
    │   ├── components/             # CSS cho từng component (navbar, weather-card, ...)
    │   │   ├── navbar.css
    │   │   ├── weather-card.css
    │   │   ├── forecast-chart.css
    │   │   ├── aqi-gauge.css
    │   │   ├── alert-card.css
    │   │   └── footer.css
    │   └── pages/                  # CSS cho từng page (home, detail, login, ...)
    │       ├── home.css
    │       ├── detail.css
    │       ├── forecast.css
    │       ├── aqi.css
    │       ├── alerts.css
    │       ├── typhoon.css
    │       ├── login.css
    │       └── favorites.css
    ├── icons/
    │   ├── ui/                     # Icon giao diện
    │   └── weather/                # Icon thời tiết
    ├── images/
    │   ├── backgrounds/            # Ảnh nền hero, section
    │   ├── cities/                 # Ảnh đại diện thành phố
    │   └── typhoon/                # Ảnh minh họa bão
    └── screenshots/                # Ảnh chụp màn hình demo
```

---

## 3. Luồng dữ liệu (Data Flow)

### 3.1 Sơ đồ tổng quát

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TRÌNH DUYỆT                                  │
│                                                                         │
│  index.html                                                             │
│     │                                                                   │
│     ▼                                                                   │
│  main.js ──► themeService.init()   ← LocalStorage (theme)              │
│     │                                                                   │
│     ▼                                                                   │
│  router.init()  ◄──── window.hashchange ◄──── URL: #/detail?city=X    │
│     │                                                                   │
│     ▼                                                                   │
│  router.handleRoute()                                                   │
│     │                                                                   │
│     ├─── Parse hash → path + query params                              │
│     ├─── Lookup routes[path] → tìm page tương ứng                     │
│     ├─── Hiển thị Loading Spinner                                       │
│     ▼                                                                   │
│  page.render(params)  ◄─── Mỗi page gọi services để lấy dữ liệu      │
│     │                                                                   │
│     ├──► weatherService / alertService / storageService                 │
│     │        │                                                          │
│     │        ▼                                                          │
│     │    apiClient.getBundle(cityName)                                  │
│     │        │                                                          │
│     │        ├─── Kiểm tra in-memory cache (TTL 5 phút)               │
│     │        │        ├── Cache HIT → trả dữ liệu ngay                │
│     │        │        └── Cache MISS ↓                                  │
│     │        │                                                          │
│     │        ├─── toApiQuery(cityName)                                 │
│     │        │        ├── Tra CITY_QUERY_MAP → tọa độ "lat,lon"        │
│     │        │        └── Fallback: removeDiacritics() → gửi tên ASCII │
│     │        │                                                          │
│     │        ▼                                                          │
│     │    ┌─────────────────────────────────────────┐                   │
│     │    │  WeatherAPI.com                          │                   │
│     │    │  GET /v1/forecast.json                   │                   │
│     │    │  ?q=lat,lon&days=3&aqi=yes&alerts=yes   │                   │
│     │    └─────────────┬───────────────────────────┘                   │
│     │                  │                                                │
│     │                  ▼ JSON thô (bundle)                             │
│     │                                                                   │
│     │    weatherMapper (pure functions)                                 │
│     │        ├── mapCurrent(bundle)  → { temp, icon, humidity, ... }   │
│     │        ├── mapHourly(bundle)   → [{ time, temp, icon, pop }]     │
│     │        ├── mapDaily(bundle)    → [{ day, tempMax, tempMin, ... }]│
│     │        ├── mapAQI(bundle)      → { score, pollutants, advice }   │
│     │        ├── mapAlerts(bundle)   → [{ title, severity, area }]     │
│     │        └── mapTyphoon(bundle)  → { name, severity, areas, ... } │
│     │                                                                   │
│     ▼                                                                   │
│  HTML string ──► appContainer.innerHTML                                │
│     │                                                                   │
│     ▼                                                                   │
│  page.afterRender(params)                                               │
│     │                                                                   │
│     ├── Gắn event listeners (click, submit, input)                     │
│     ├── Init Chart.js (biểu đồ nhiệt độ)                              │
│     ├── Init Leaflet maps (radar, heatmap, typhoon tracker)            │
│     └── Navbar.afterRender() (theme toggle, logout)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Luồng theo từng tính năng

#### 🔍 Tìm kiếm thành phố

```
User gõ ở ô tìm kiếm (HomeHeroSection)
  │
  ▼ input event (debounce 300ms)
  apiClient.search(term)
  │   └── removeDiacritics(term) → GET /search.json
  ▼
  Hiển thị dropdown gợi ý (tối đa 6 kết quả)
  │
  ├── User click gợi ý / Enter:
  │     toDisplayName(apiName) → chuẩn hóa tên tiếng Việt
  │     window.location.hash = #/detail?city=<tên>
  │     └── Router bắt hashchange → render detailPage
  │
  └── Không có kết quả → showNotFound()
```

#### ⭐ Quản lý Yêu thích (theo tài khoản trên Supabase)

```
User click nút ⭐ trên WeatherCard
  │
  ▼ event listener (WeatherCard.afterRender) — async
  │
  ├── CHƯA đăng nhập → window.location.hash = #/login  (bắt buộc đăng nhập, dừng lại)
  │
  └── ĐÃ đăng nhập → favoritesService.toggleFavorite(cityName)
        │   ├── INSERT / DELETE hàng vào bảng Supabase "favorites" (theo user_id)
        │   └── Cập nhật cache RAM đồng bộ (mảng tên TP của user hiện tại)
        ▼
        Toggle icon sao (vàng ↔ xám) theo trạng thái trả về

  Trang Favorites (yêu cầu đăng nhập — guard storageService.getUser):
  await favoritesService.load()   ← SELECT city FROM favorites WHERE user_id = <uid>
  │   └── favoritesService.getFavorites() (đọc cache) → Promise.allSettled(getCurrentWeather)
  │   └── Render grid WeatherCard cho từng TP
  ▼
  Khi bỏ thích trên trang Favorites → DELETE + remove DOM element ngay lập tức
```

> **Vì sao có cache RAM?** `WeatherCard.render()` cần biết ĐỒNG BỘ một TP có đang được
> yêu thích không (để vẽ sao đầy/rỗng), trong khi Supabase là async. Giải pháp:
> `favoritesService.load()` nạp danh sách vào cache 1 lần lúc khởi động / đổi phiên
> (gọi từ `authService.init()`), sau đó `isFavorite()`/`getFavorites()` đọc cache tức thì.

#### 🔐 Đăng ký / Đăng nhập / Đăng xuất (Supabase Auth)

```
Khởi động app (main.js):
  await authService.init()
  │   └── supabase.auth.getSession() → nếu có phiên: mirror {id,email,name} vào LocalStorage
  │         + favoritesService.load(); nếu không: clear. Đăng ký onAuthStateChange để giữ đồng bộ.

Đăng ký (registerPage):
  ▼ authService.register(email, password)
  │   └── supabase.auth.signUp(...) (đã tắt Confirm email → có session ngay)
  │         ├── OK → setUser({id,email,name}) → redirect #/ + reload
  │         └── Lỗi → alert (thông báo tiếng Việt đã map)

Đăng nhập (loginPage):
  ▼ authService.login(email, password)
  │   └── supabase.auth.signInWithPassword(...)
  │         ├── OK → setUser({id,email,name}) → redirect #/ + reload
  │         └── Sai → "Email hoặc mật khẩu không đúng."

Đăng xuất (Navbar #navLogoutBtn):
  ▼ authService.logout()
  │   └── supabase.auth.signOut() + storageService.logout() + favoritesService.clear()
  │       redirect → #/ + reload
```

#### 🌓 Chuyển đổi Dark/Light Mode

```
User click nút theme-toggle trên Navbar
  │
  ▼ themeService.toggleTheme()
  │   └── Đổi giá trị "light" ↔ "dark" trong LocalStorage
  │       Gán data-theme + data-bs-theme lên <html>
  │       → CSS variables trong base.css tự chuyển toàn bộ màu sắc
  ▼
  window.location.reload() → toàn bộ app re-render với theme mới
```

#### 🌊 Luồng hiển thị trang chi tiết (detailPage)

```
URL: #/detail?city=Hà Nội
  │
  ▼ router.handleRoute()
  │   parse params → { city: "Hà Nội" }
  ▼ detailPage.render({ city: "Hà Nội" })
  │   storageService.setLastCity("Hà Nội")  ← lưu TP để Navbar bám theo
  │
  ├── DetailHeaderSection.render(city)
  │     └── weatherService.getCurrentWeather(city) → WeatherCard (non-interactive)
  │
  ├── Detail24hSection.render(city)
  │     └── weatherService.getHourlyForecast(city) → ForecastChart.renderHourly()
  │
  ├── DetailMetricsSection.render(city)
  │     └── weatherService.getCurrentWeather(city) → 6 metric cards
  │         (Cảm giác, Gió, Áp suất, Tầm nhìn, Điểm sương, UV)
  │
  └── DetailRadarSection.render(city)
        └── weatherService.getCurrentWeather(city) → Leaflet map (lat, lon)
            + OpenStreetMap tile + RainViewer radar overlay
```

---

## 4. Chi tiết từng file & nhiệm vụ

### 4.1 Entry Point & Cấu hình

| File               | Nhiệm vụ                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `index.html`       | HTML duy nhất của SPA. Load CDN (Bootstrap, Leaflet, Chart.js, Lucide). Chứa `<div id="app">` làm mount point. Load `src/main.js` dạng ES module. |
| `src/main.js`      | Entry point JS. Khi DOM ready: `themeService.init()` (theme đã lưu) → `await authService.init()` (khôi phục phiên Supabase + nạp favorites) → `router.init()` + `router.handleRoute()` (render trang hiện tại). |
| `.env`             | Chứa `VITE_WEATHER_API_KEY` (WeatherAPI.com) + `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (Supabase). **KHÔNG** commit lên Git. |
| `.env.example`     | Mẫu `.env` để hướng dẫn người mới điền key WeatherAPI + Supabase.                                       |
| `package.json`     | Metadata + scripts: `dev` (Vite dev server), `build` (production), `preview` (xem bản build).          |

### 4.2 Router (SPA Hash Router)

| File                    | Nhiệm vụ                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `src/router/router.js`  | **SPA Hash Router** tự xây. Lắng nghe `hashchange`. Từ URL hash, tách `path` + `query params` → tra bảng `routes{}` → gọi `page.render()` rồi `page.afterRender()`. Hiển thị spinner trong lúc chờ API, và trang lỗi khi thất bại. |

**Bảng routes đăng ký:**

| Hash Path      | Page Module          | Mô tả                    |
| -------------- | -------------------- | ------------------------- |
| `/` (mặc định) | `homePage`           | Trang chủ                 |
| `/login`       | `loginPage`          | Đăng nhập                 |
| `/register`    | `registerPage`       | Đăng ký tài khoản mới     |
| `/detail`      | `detailPage`         | Chi tiết thời tiết 1 TP   |
| `/favorites`   | `favoritesPage`      | Địa điểm yêu thích        |
| `/alerts`      | `alertsPage`         | Cảnh báo & bản đồ         |
| `/typhoon`     | `typhoonDetailPage`  | Chi tiết bão khẩn cấp     |
| `/forecast`    | `forecastPage`       | Dự báo nhiều ngày         |
| `/aqi`         | `aqiPage`            | Chất lượng không khí       |

### 4.3 Services (Tầng dữ liệu)

| File                        | Nhiệm vụ                                                                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiClient.js`              | **Tầng gọi mạng duy nhất.** `getBundle()` gọi WeatherAPI.com endpoint `/forecast.json` (current + forecast + AQI + alerts trong 1 request). Có in-memory cache (Map) TTL 5 phút giúp nhiều section cùng trang dùng chung 1 response. Hàm `search()` gọi `/search.json` cho autocomplete (nuốt lỗi → trả `[]`). Hai helper nội bộ: `buildUrl()` (dựng URL + gắn key/params) và `fetchJson()` (gọi fetch + gom xử lý lỗi mạng/HTTP). |
| `weatherService.js`         | **Facade** cho pages tiêu thụ. 4 phương thức: `getCurrentWeather`, `getHourlyForecast`, `get7DayForecast`, `getAQI`. Mỗi hàm gọi `apiClient.getBundle()` rồi chuyển qua mapper tương ứng. |
| `weatherMapper.js`          | **Pure mapping functions.** Chuyển JSON thô weatherapi → shape object mà UI cần. Bao gồm: `mapCurrent`, `mapHourly`, `mapDaily`, `mapAQI`, `mapAlerts`, `mapTyphoon`. Chứa logic: icon code → tên icon, UV → mức Việt, hướng gió → tiếng Việt, PM2.5 → AQI US EPA, phân mức AQI, lời khuyên sức khỏe. |
| `alertService.js`           | **Facade cho cảnh báo.** 2 phương thức: `getTyphoonAlert` (1 object hoặc null), `getActiveAlerts` (mảng alerts). Gọi qua apiClient → weatherMapper.             |
| `supabaseClient.js`         | **Khởi tạo Supabase client.** Nạp `@supabase/supabase-js` qua CDN ESM (`esm.sh`), đọc `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`. Nếu thiếu env → export **stub** (giả lập `.auth` và `.from()`) để app không sập, chỉ báo lỗi tiếng Việt khi thao tác. |
| `authService.js`            | **Xác thực Supabase.** `register`/`login` (async, gọi `supabase.auth.*`), `logout` (signOut + clear), `init` (khôi phục phiên khi tải trang + nạp favorites + `onAuthStateChange`), `isAuthenticated`. Mirror `{id, email, name}` vào LocalStorage qua storageService. Map lỗi Supabase → tiếng Việt. |
| `favoritesService.js`       | **Yêu thích theo tài khoản.** Bọc bảng Supabase `favorites`. `load()` (SELECT → nạp cache), `clear()`, `getFavorites()`/`isFavorite()` (đọc **cache RAM** đồng bộ cho UI), `toggleFavorite()` (INSERT/DELETE + cập nhật cache). Lấy `user_id` từ `storageService.getUser()?.id`. |
| `storageService.js`         | **Quản lý LocalStorage.** 2 nhóm key: `weatherpulse_auth` (JSON user `{id,email,name}`), `weatherpulse_last_city` (string). Hàm: `getUser`, `setUser`, `logout`, `getLastCity`, `setLastCity`. (Favorites đã chuyển sang `favoritesService` + Supabase.) |
| `themeService.js`           | **Dark/Light mode.** Đọc/ghi key `weatherpulse_theme` trong LocalStorage. `setTheme()` gán attribute `data-theme` + `data-bs-theme` lên `<html>`, kích hoạt CSS variables. Default: `light`. |

### 4.4 Components (UI tái sử dụng)

Mỗi component export object với `render()` trả HTML string, và `afterRender()` gắn event listeners.

| Component           | Nhiệm vụ                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Navbar.js`         | Thanh điều hướng trên cùng. Tự detect route active từ `location.hash`. Đồng bộ `?city=` param vào link Navbar (Detail, Forecast, AQI luôn bám theo TP hiện tại). Hiển thị user dropdown khi đã đăng nhập. Nút theme toggle (sáng/tối). |
| `Footer.js`         | Footer cố định cuối trang. Logo, mô tả, link nhanh, copyright.                                                                                    |
| `WeatherCard.js`    | Thẻ thời tiết đa năng. 2 mode: **full** (tên, nhiệt độ lớn, condition, cảm giác, gió, ẩm) và **compact** (nhỏ gọn hơn). Nút ⭐ đọc trạng thái từ `favoritesService.isFavorite()` (cache); khi bấm: **chưa đăng nhập → chuyển `#/login`**, đã đăng nhập → `favoritesService.toggleFavorite()` (async, lưu Supabase). Click thẻ → điều hướng `/detail?city=`. `options.interactive = false` để chỉ hiển thị. |
| `ForecastChart.js`  | 2 phần: `renderHourly()` (strip ngang icon + nhiệt độ theo giờ) và `renderChartCanvas()` + `initChart()` (biểu đồ đường Chart.js nhiệt độ, tự adapt màu theo theme). |
| `AQIGauge.js`       | Vòng tròn hiển thị chỉ số AQI. Tự đổi màu theo mức (good/moderate/unhealthy/hazardous).                                                          |
| `AlertCard.js`      | Thẻ cảnh báo thiên tai. 2 mức: `danger` (đỏ, pulse animation) và `warning` (vàng). Hiển thị severity badge, tiêu đề, khu vực, nút xem chi tiết.   |

### 4.5 Pages (Trang chức năng)

Mỗi page là 1 thư mục chứa 1 file container (kết nối Navbar + sections + Footer) và nhiều section files.

#### `homePage/` — Trang chủ (`#/`)

| File                       | Nhiệm vụ                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| `homePage.js`              | Container. Lắp ghép: Navbar → AlertCard (nếu có cảnh báo) → Hero → Current → Suggested → Footer. |
| `HomeHeroSection.js`       | Banner hero + ô tìm kiếm với autocomplete gợi ý địa điểm. Debounce 300ms. Enter → chọn gợi ý #1. Chuẩn hóa tên TP qua `toDisplayName()`. |
| `HomeCurrentSection.js`    | Thời tiết hiện tại TP mặc định (Hà Nội) bằng WeatherCard full-size.                               |
| `HomeSuggestedSection.js`  | Grid thẻ compact cho các TP gợi ý (HCM, Đà Nẵng, Tokyo, ...).                                    |

#### `detailPage/` — Chi tiết thời tiết (`#/detail?city=X`)

| File                       | Nhiệm vụ                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `detailPage.js`            | Container. Nhận `?city=` param, lưu vào lastCity, render 4 sections.               |
| `DetailHeaderSection.js`   | Header: WeatherCard non-interactive (chỉ hiển thị, không click/sao).               |
| `Detail24hSection.js`      | Dự báo 24h: gọi `getHourlyForecast()` → `ForecastChart.renderHourly()`.            |
| `DetailMetricsSection.js`  | 6 thẻ metric: Cảm giác, Gió (tốc độ + hướng), Áp suất, Tầm nhìn, Điểm sương, UV. |
| `DetailRadarSection.js`    | Bản đồ Leaflet: OpenStreetMap tile + radar mây/mưa từ RainViewer API.              |

#### `forecastPage/` — Dự báo nhiều ngày (`#/forecast?city=X`)

| File                           | Nhiệm vụ                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `forecastPage.js`              | Container.                                                                    |
| `ForecastChartSection.js`      | Biểu đồ đường nhiệt độ max/min qua các ngày (Chart.js).                     |
| `Forecast7DaysListSection.js`  | Danh sách dự báo: mỗi ngày = 1 row (thứ, ngày, icon, condition, max, min).  |

#### `aqiPage/` — Chất lượng không khí (`#/aqi?city=X`)

| File                          | Nhiệm vụ                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `aqiPage.js`                  | Container.                                                                     |
| `AQIGaugeSection.js`          | AQIGauge component lớn (vòng tròn AQI).                                       |
| `AQIPollutantsSection.js`     | 6 thẻ chất ô nhiễm (PM2.5, PM10, SO₂, NO₂, O₃, CO) với giá trị + đơn vị.   |
| `AQIHealthAdviceSection.js`   | Lời khuyên sức khỏe: chia theo nhóm (người bình thường, nhạy cảm, thể thao).|

#### `alertsPage/` — Cảnh báo & Bản đồ (`#/alerts`)

| File                        | Nhiệm vụ                                                              |
| --------------------------- | ---------------------------------------------------------------------- |
| `alertsPage.js`             | Container.                                                              |
| `AlertsHeatmapSection.js`   | Bản đồ Leaflet heatmap (radar mưa/nhiệt từ RainViewer).               |
| `AlertsListSection.js`      | Render danh sách AlertCard từ `alertService.getActiveAlerts()`.         |

#### `typhoonDetailPage/` — Chi tiết bão (`#/typhoon`)

| File                              | Nhiệm vụ                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `typhoonDetailPage.js`            | Container. Gọi `alertService.getTyphoonAlert()`. Nếu null → empty state (an toàn).|
| `TyphoonBannerSection.js`         | Banner đỏ: tên bão, mức nghiêm trọng, thời gian hiệu lực, mô tả.                |
| `TyphoonTrackerSection.js`        | Bản đồ Leaflet: marker tâm bão + radar overlay.                                   |
| `TyphoonActionsSection.js`        | Hướng dẫn hành động + số hotline cứu hộ (112, 114, 115).                          |
| `TyphoonAffectedAreasSection.js`  | Bảng khu vực chịu ảnh hưởng + mức rủi ro.                                         |

#### `loginPage/` — Đăng nhập (`#/login`)

| File              | Nhiệm vụ                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| `loginPage.js`    | Form đăng nhập (async). Ẩn/hiện password. Gọi `authService.login()`. Thành công → redirect home. Có link sang `#/register`. |

#### `registerPage/` — Đăng ký (`#/register`)

| File               | Nhiệm vụ                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `registerPage.js`  | Form đăng ký: email + mật khẩu + xác nhận mật khẩu (nút ẩn/hiện **riêng** cho từng ô). Validate client (≥ 6 ký tự, khớp xác nhận) trước khi gọi `authService.register()`. Tái dùng CSS của loginPage. Có link sang `#/login`. |

#### `favoritesPage/` — Yêu thích (`#/favorites`)

| File                | Nhiệm vụ                                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `favoritesPage.js`  | Yêu cầu đăng nhập (guard `storageService.getUser`). `await favoritesService.load()` → lấy danh sách từ Supabase → `weatherService.getCurrentWeather()` cho từng TP → Grid WeatherCard. Bỏ thích → DELETE Supabase + xóa card khỏi DOM realtime. |

### 4.6 Utils (Tiện ích)

| File                       | Nhiệm vụ                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `src/utils/formatters.js`  | `formatTemp(temp, unit)` — format nhiệt độ °C/°F. `getWeatherIconSvg(iconName)` — map tên icon nội bộ → class Bootstrap Icon + màu. |

### 4.7 Config (Hằng số & Cấu hình)

| File                        | Nhiệm vụ                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/config/constants.js`   | **Trung tâm cấu hình toàn app.** Chứa: `ROUTES` (enum 9 routes, gồm `REGISTER`), `APP_CONFIG` (name, version, default city), `API_CONFIG` (base URL, API key từ env, lang, forecast days), `CITY_QUERY_MAP` (tên Việt → tọa độ chính xác), `CANONICAL_ALIASES` (tên API trả về → tên chuẩn tiếng Việt), `removeDiacritics()`, `toApiQuery()`, `toDisplayName()`. *(Đã bỏ `DEMO_ACCOUNTS` — auth nay dùng Supabase.)* |

### 4.8 Assets (CSS, Icons, Images)

| Đường dẫn                          | Nhiệm vụ                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| `assets/css/main.css`              | Master stylesheet: `@import` tất cả file CSS con (base → components → pages).     |
| `assets/css/base.css`              | CSS nền tảng: CSS custom properties (`--wp-*`), theme `[data-theme="dark"]`, typography (Inter + Outfit), glassmorphism cards, utility classes, scrollbar. |
| `assets/css/components/*.css`      | CSS riêng cho từng component (navbar, weather-card, forecast-chart, aqi-gauge, alert-card, footer). |
| `assets/css/pages/*.css`           | CSS riêng cho từng page (home hero, detail metrics, login card, ...).               |
| `assets/icons/ui/`                 | Icon giao diện (nếu có icon tùy chỉnh ngoài Bootstrap Icons).                     |
| `assets/icons/weather/`            | Icon thời tiết (nếu có icon SVG tùy chỉnh).                                       |
| `assets/images/backgrounds/`       | Ảnh nền cho hero sections.                                                          |
| `assets/images/cities/`            | Ảnh đại diện thành phố (dùng trong cards gợi ý nếu cần).                           |
| `assets/images/typhoon/`           | Ảnh minh họa bão (banner, tracker).                                                 |
| `assets/screenshots/`              | Ảnh chụp màn hình demo (cho README.md, tài liệu).                                  |

---

## 5. Sơ đồ kiến trúc tổng thể

```
                    ┌───────────────────────────────────┐
                    │           index.html               │
                    │   CDNs: Bootstrap, Leaflet,        │
                    │   Chart.js, Lucide, Google Fonts   │
                    │          ↓ <script module>         │
                    └───────────────┬───────────────────┘
                                    │
                              ┌─────▼─────┐
                              │  main.js   │
                              │  (entry)   │
                              └──┬────┬───┘
                                 │    │
                    ┌────────────▼┐  ┌▼────────────┐
                    │ themeService│  │   router.js  │
                    │ (init dark/ │  │ (hashchange) │
                    │  light)     │  └──────┬───────┘
                    └─────────────┘         │
                                            │ routes[path]
                          ┌─────────────────┼─────────────────┐
                          ▼                 ▼                 ▼
                     ┌─────────┐      ┌──────────┐     ┌──────────┐
                     │homePage │      │detailPage│     │aqiPage   │  ... (8 pages)
                     └────┬────┘      └────┬─────┘     └────┬─────┘
                          │                │                 │
          ┌───────────────┼────────────────┼─────────────────┤
          ▼               ▼                ▼                 ▼
    ┌──────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────┐
    │Components│   │Components│   │  Components  │   │Components│
    │ Navbar   │   │WeatherCard│  │  AQIGauge    │   │AlertCard │
    │ Footer   │   │ForecastChart│ │              │   │          │
    └────┬─────┘   └─────┬─────┘  └──────┬───────┘   └────┬─────┘
         │               │               │                 │
         └───────────────┼───────────────┤─────────────────┘
                         │               │
              ┌──────────▼───────────────▼──────────┐
              │           SERVICES LAYER             │
              │                                      │
              │  weatherService ──► apiClient ──────►│──► WeatherAPI.com
              │  alertService   ──┘   (cache)        │
              │                                      │
              │  authService ─────► supabaseClient ──│──► Supabase (Auth)
              │  favoritesService ┘  (+ cache RAM)   │──► Supabase (bảng favorites)
              │       └──► storageService ───────────│──► LocalStorage (auth mirror, theme)
              │  themeService ─────┘                 │
              │                                      │
              │  weatherMapper (pure transform)      │
              └──────────────────────────────────────┘
```

---

## 6. Quy ước & Pattern quan trọng

### 6.1 Mô hình render 2 pha

Mọi page và component đều theo pattern:
1. **`render(params)`** — Trả HTML string (gọi API, build markup). Chạy trước khi chèn DOM.
2. **`afterRender(params)`** — Gắn event listeners, init thư viện (Chart.js, Leaflet). Chạy sau khi HTML đã vào DOM.

### 6.2 Dữ liệu TP bám theo user (City Sync)

- Khi user xem chi tiết 1 TP → `storageService.setLastCity(city)`.
- Navbar tự đọc `?city=` hoặc fallback `getLastCity()` → gắn vào link Detail/Forecast/AQI.
- Kết quả: user xem "Đà Nẵng" → tất cả link navbar đều bám theo "Đà Nẵng".

### 6.3 Cache thông minh (apiClient)

- Tất cả 4 phương thức `weatherService.*` + `alertService.*` đều gọi cùng `apiClient.getBundle(city)`.
- apiClient cache theo `bundle:<query>` key, TTL 5 phút.
- ⇒ 1 trang gọi 3-4 section khác nhau cho cùng TP = chỉ 1 request API thật.

### 6.4 Xử lý tên tiếng Việt

- **CITY_QUERY_MAP**: Tên Việt → tọa độ `"lat,lon"`. Tránh weatherapi trả sai vị trí (ví dụ "Hue" → Ethiopia).
- **removeDiacritics()**: Tên không có trong map → bỏ dấu trước khi gửi API.
- **CANONICAL_ALIASES**: Tên API trả về (vd "Ho Chi Minh City") → tên chuẩn app ("TP. Hồ Chí Minh"). Tránh trùng lặp trong Favorites.

### 6.5 Theme System

- CSS dùng custom properties (`--wp-bg-main`, `--wp-text-main`, ...) trong `base.css`.
- Selector `[data-theme="dark"]` override toàn bộ CSS variables.
- Bootstrap cũng nhận `data-bs-theme="dark"` để tự chuyển component styles.

### 6.6 Auth (Supabase) + đồng bộ về LocalStorage

- **Nguồn sự thật** là phiên Supabase; nhưng UI (Navbar, guard trang) vẫn đọc `storageService.getUser()` **đồng bộ**.
- `authService.init()` chạy 1 lần lúc khởi động (trong `main.js`, **trước** router): lấy session → mirror `{id,email,name}` vào LocalStorage, và đăng ký `onAuthStateChange` để giữ đồng bộ về sau.
- Login/Register/Logout đều `window.location.reload()` → `init()` chạy lại → trạng thái luôn nhất quán sau F5.

### 6.7 Favorites theo tài khoản + cache RAM đồng bộ

- Dữ liệu thật nằm ở bảng Supabase `favorites(user_id, city)` với **RLS** (mỗi user chỉ đọc/ghi hàng của mình).
- `favoritesService` giữ một **cache RAM** (mảng tên TP) để `WeatherCard.render()` quyết định icon sao mà không cần `await`. Cache được nạp bởi `favoritesService.load()` khi khởi động / đổi phiên.
- Ghi (thêm/bỏ) luôn đi qua Supabase (async) rồi cập nhật cache. Chưa đăng nhập → nút sao chuyển hướng sang trang đăng nhập.
- **Chưa cấu hình Supabase**: `supabaseClient` trả stub → app vẫn chạy, favorites rỗng, không sập.

---

## 7. API & Nguồn dữ liệu bên ngoài

| Dịch vụ                | Endpoint                        | Dùng cho                               | Ghi chú                     |
| ----------------------- | ------------------------------- | -------------------------------------- | ---------------------------- |
| **WeatherAPI.com**      | `/v1/forecast.json`             | Current + Forecast + AQI + Alerts      | API key trong `.env`         |
| **WeatherAPI.com**      | `/v1/search.json`               | Autocomplete gợi ý địa điểm            | Không cần key riêng          |
| **Supabase**            | `@supabase/supabase-js` (esm.sh)| Xác thực (Auth) + bảng `favorites` (DB) | Cần `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| **OpenStreetMap**       | `tile.openstreetmap.org`        | Tile bản đồ nền cho Leaflet            | Miễn phí, không cần key      |
| **RainViewer**          | `tilecache.rainviewer.com`      | Radar mây/mưa overlay trên Leaflet     | Miễn phí, không cần key      |
| **Google Fonts**        | `fonts.googleapis.com`          | Font chữ: Inter (body), Outfit (display) | CDN                        |

---

## 8. Hướng dẫn chạy dự án

### Chuẩn bị

```bash
# 1. Clone repository
git clone <repo-url>
cd Frog_Weather

# 2. Tạo file .env từ mẫu
cp .env.example .env

# 3. Điền các biến vào .env:
#    VITE_WEATHER_API_KEY    → lấy miễn phí tại https://www.weatherapi.com/
#    VITE_SUPABASE_URL       → Supabase dashboard: Settings → API (Project URL)
#    VITE_SUPABASE_ANON_KEY  → Supabase dashboard: Settings → API (anon public key)
```

### Cấu hình Supabase (bắt buộc cho đăng nhập & yêu thích)

1. Tạo project tại [supabase.com](https://supabase.com).
2. **Authentication → Providers → Email** → **TẮT** "Confirm email" (đăng ký xong đăng nhập được ngay).
3. Vào **SQL Editor**, chạy đoạn SQL tạo bảng `favorites` + bật RLS:

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

### Chạy Development

```bash
npm run dev
# Mở trình duyệt tại http://localhost:5173
```

### Build Production

```bash
npm run build      # Output → dist/
npm run preview    # Xem bản build tại http://localhost:4173
```

### Tài khoản

Không còn tài khoản demo hardcode. Hãy **tự đăng ký** tại `#/register` (email + mật khẩu).
Tài khoản được tạo và quản lý trên Supabase → **Authentication → Users**.

---

> 📝 **Cập nhật lần cuối:** 21/08/2026 — bổ sung Supabase Auth (đăng ký/đăng nhập) & lưu địa điểm yêu thích theo tài khoản.  
> 🔧 **Dành cho:** Đội phát triển nội bộ WeatherPulse
