// ForecastPage Main Container
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES, APP_CONFIG } from '../../config/constants.js';
import { storageService } from '../../services/storageService.js';
import { ForecastChartSection } from './ForecastChartSection.js';
import { Forecast7DaysListSection } from './Forecast7DaysListSection.js';

export const forecastPage = {
  render: async (params = {}) => {
    const city = params.city || storageService.getLastCity() || APP_CONFIG.DEFAULT_CITY;

    return `
      <div class="wp-forecast-page page-wrapper">
        ${Navbar.render(ROUTES.FORECAST)}

        <main class="container my-4">
          <div class="mb-4">
            <h2 class="font-display wp-text-main mb-1"><i class="bi bi-calendar3 text-primary me-2"></i>Dự báo Thời tiết nhiều ngày</h2>
            <p class="wp-text-muted mb-0">Cập nhật lộ trình thời tiết những ngày tới cho ${city}.</p>
          </div>

          ${await ForecastChartSection.render(city)}
          ${await Forecast7DaysListSection.render(city)}
        </main>

        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async (params = {}) => {
    const city = params.city || storageService.getLastCity() || APP_CONFIG.DEFAULT_CITY;
    Navbar.afterRender();
    await ForecastChartSection.afterRender(city);
    await Forecast7DaysListSection.afterRender();
  }
};
