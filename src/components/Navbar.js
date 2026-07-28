// Navbar Component (Dynamic Hash Active Route & Exact City Synchronization)
import { ROUTES, APP_CONFIG } from '../config/constants.js';
import { storageService } from '../services/storageService.js';
import { themeService } from '../services/themeService.js';

export const Navbar = {
  render: (overrideRoute = null) => {
    const user = storageService.getUser();
    const currentTheme = themeService.getTheme();

    // Dynamically detect current path and query params from window.location.hash
    const rawHash = window.location.hash.slice(1) || ROUTES.HOME;
    const [hashPath, queryString] = rawHash.split('?');
    const activeRoute = overrideRoute || hashPath || ROUTES.HOME;
    const isLoginActive = activeRoute === ROUTES.LOGIN;

    // Detect active city from URL query param or LocalStorage fallback
    let currentCity = null;
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      if (urlParams.has('city')) {
        currentCity = decodeURIComponent(urlParams.get('city'));
        storageService.setLastCity(currentCity);
      }
    }
    if (!currentCity) {
      currentCity = storageService.getLastCity() || APP_CONFIG.DEFAULT_CITY;
    }

    const cityQ = `?city=${encodeURIComponent(currentCity)}`;

    const isHomeActive = activeRoute === ROUTES.HOME || activeRoute === '';
    const isDetailActive = activeRoute === ROUTES.DETAIL;
    const isFavActive = activeRoute === ROUTES.FAVORITES;
    const isAlertsActive = activeRoute === ROUTES.ALERTS || activeRoute === ROUTES.TYPHOON;
    const isForecastActive = activeRoute === ROUTES.FORECAST;
    const isAqiActive = activeRoute === ROUTES.AQI;

    return `
      <nav class="navbar navbar-expand-lg wp-navbar">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center gap-2" href="#${ROUTES.HOME}">
            <div class="brand-icon bg-primary text-white rounded-3 p-1 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
              <i class="bi bi-cloud-sun-fill fs-5"></i>
            </div>
            <span class="brand-logo fs-4">WeatherPulse</span>
          </a>

          <div class="d-flex align-items-center gap-2 ms-auto me-2 d-lg-none">
            <!-- Mobile Theme Switcher -->
            <button class="theme-toggle-btn btn-theme-toggle" title="Chuyển đổi giao diện Sáng/Tối">
              <i class="bi ${currentTheme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'}"></i>
            </button>
          </div>

          <button class="navbar-toggler border-secondary text-body" type="button" data-bs-toggle="collapse" data-bs-target="#wpNavbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="wpNavbarNav">
            <ul class="navbar-nav me-auto ms-lg-4 mb-2 mb-lg-0 gap-1">
              <li class="nav-item">
                <a class="nav-link ${isHomeActive ? 'active' : ''}" href="#${ROUTES.HOME}">
                  <i class="bi bi-house-door me-1"></i> Trang chủ
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${isDetailActive ? 'active' : ''}" href="#${ROUTES.DETAIL}${cityQ}">
                  <i class="bi bi-geo-alt me-1"></i> ${currentCity}
                </a>
              </li>
              <li class="nav-item">
                ${user ? `
                  <a class="nav-link ${isFavActive ? 'active' : ''}" href="#${ROUTES.FAVORITES}">
                    <i class="bi bi-star me-1"></i> Yêu thích
                  </a>
                ` : `
                  <a class="nav-link disabled opacity-50" tabindex="-1" aria-disabled="true" title="Đăng nhập để xem">
                    <i class="bi bi-lock me-1"></i> Yêu thích
                  </a>
                `}
              </li>
              <li class="nav-item">
                <a class="nav-link ${isAlertsActive ? 'active text-warning fw-semibold' : ''}" href="#${ROUTES.ALERTS}">
                  <i class="bi bi-exclamation-triangle-fill me-1 text-warning"></i> Cảnh báo
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${isForecastActive ? 'active' : ''}" href="#${ROUTES.FORECAST}${cityQ}">
                  <i class="bi bi-calendar3 me-1"></i> Dự báo
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${isAqiActive ? 'active' : ''}" href="#${ROUTES.AQI}${cityQ}">
                  <i class="bi bi-wind me-1"></i> AQI Không khí
                </a>
              </li>
            </ul>

            <div class="d-flex align-items-center gap-2">
              <!-- Desktop Theme Switcher Button -->
              <button class="theme-toggle-btn btn-theme-toggle d-none d-lg-flex" title="Chuyển đổi giao diện Sáng/Tối">
                <i class="bi ${currentTheme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'}"></i>
              </button>

              ${user ? `
                <div class="dropdown">
                  <button class="btn btn-outline-primary dropdown-toggle rounded-pill px-3 py-1 text-truncate" style="max-width: 160px;" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i> ${user.email.split('@')[0]}
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end wp-dropdown-menu">
                    <li><a class="dropdown-item" href="#${ROUTES.FAVORITES}"><i class="bi bi-star me-2"></i>Địa điểm đã lưu</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger" id="navLogoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</button></li>
                  </ul>
                </div>
              ` : `
                <a href="#${ROUTES.LOGIN}" class="btn btn-primary rounded-pill px-4 ${isLoginActive ? 'd-none' : ''}">
                  <i class="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </a>
              `}
            </div>
          </div>
        </div>
      </nav>
    `;
  },

  afterRender: () => {
    // Theme toggle listener
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        themeService.toggleTheme();
        window.location.reload();
      });
    });

    const logoutBtn = document.getElementById('navLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        storageService.logout();
        window.location.hash = ROUTES.HOME;
        window.location.reload();
      });
    }
  }
};
