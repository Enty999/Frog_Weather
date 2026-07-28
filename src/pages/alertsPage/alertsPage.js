// AlertsPage Main Container
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES, APP_CONFIG } from '../../config/constants.js';
import { storageService } from '../../services/storageService.js';
import { AlertsHeatmapSection } from './AlertsHeatmapSection.js';
import { AlertsListSection } from './AlertsListSection.js';

export const alertsPage = {
  render: async (params = {}) => {
    const city = params.city || storageService.getLastCity() || APP_CONFIG.DEFAULT_CITY;

    return `
      <div class="wp-alerts-page page-wrapper">
        ${Navbar.render(ROUTES.ALERTS)}

        <main class="container my-4">
          <div class="mb-4">
            <h2 class="font-display wp-text-main mb-1"><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>Bản đồ & Cảnh báo Thiên tai</h2>
            <p class="wp-text-muted mb-0">Theo dõi thông tin diễn biến thời tiết nguy hiểm tại khu vực ${city}.</p>
          </div>

          ${await AlertsHeatmapSection.render(city)}
          ${await AlertsListSection.render(city)}
        </main>

        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async (params = {}) => {
    const city = params.city || storageService.getLastCity() || APP_CONFIG.DEFAULT_CITY;
    Navbar.afterRender();
    await AlertsHeatmapSection.afterRender(city);
    await AlertsListSection.afterRender();
  }
};
