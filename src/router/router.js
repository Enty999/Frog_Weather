// SPA Hash Router
import { ROUTES } from '../config/constants.js';
import { homePage } from '../pages/homePage/homePage.js';
import { loginPage } from '../pages/loginPage/loginPage.js';
import { detailPage } from '../pages/detailPage/detailPage.js';
import { favoritesPage } from '../pages/favoritesPage/favoritesPage.js';
import { alertsPage } from '../pages/alertsPage/alertsPage.js';
import { typhoonDetailPage } from '../pages/typhoonDetailPage/typhoonDetailPage.js';
import { forecastPage } from '../pages/forecastPage/forecastPage.js';
import { aqiPage } from '../pages/aqiPage/aqiPage.js';

const routes = {
  [ROUTES.HOME]: homePage,
  [ROUTES.LOGIN]: loginPage,
  [ROUTES.DETAIL]: detailPage,
  [ROUTES.FAVORITES]: favoritesPage,
  [ROUTES.ALERTS]: alertsPage,
  [ROUTES.TYPHOON]: typhoonDetailPage,
  [ROUTES.FORECAST]: forecastPage,
  [ROUTES.AQI]: aqiPage
};

export const router = {
  init: () => {
    window.addEventListener('hashchange', router.handleRoute);
    window.addEventListener('DOMContentLoaded', router.handleRoute);
  },

  handleRoute: async () => {
    const hash = window.location.hash.slice(1) || ROUTES.HOME;
    const [path, queryString] = hash.split('?');
    
    // Parse query params
    const params = {};
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      for (const [key, value] of urlParams.entries()) {
        params[key] = value;
      }
    }

    const page = routes[path] || homePage;
    const appContainer = document.getElementById('app');

    if (!appContainer) return;

    // Hiển thị spinner trong lúc chờ dữ liệu API
    appContainer.innerHTML = router.renderLoading();

    try {
      appContainer.innerHTML = await page.render(params);
      if (page.afterRender) {
        await page.afterRender(params);
      }
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('[Router] Lỗi khi tải trang:', err);
      appContainer.innerHTML = router.renderError(err?.message);
    }
  },

  renderLoading: () => `
    <div class="d-flex flex-column align-items-center justify-content-center text-center" style="min-height: 70vh;">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="wp-text-muted mt-3 mb-0">Đang tải dữ liệu thời tiết...</p>
    </div>
  `,

  renderError: (message) => `
    <div class="d-flex flex-column align-items-center justify-content-center text-center px-3" style="min-height: 70vh;">
      <i class="bi bi-cloud-slash-fill text-danger" style="font-size: 3.5rem;"></i>
      <h4 class="wp-text-main mt-3 mb-1">Không tải được dữ liệu thời tiết</h4>
      <p class="wp-text-muted mb-3">${message || 'Vui lòng kiểm tra kết nối mạng hoặc API key rồi thử lại.'}</p>
      <button class="btn btn-primary rounded-pill px-4" onclick="window.location.reload()">
        <i class="bi bi-arrow-clockwise me-1"></i> Thử lại
      </button>
    </div>
  `
};
