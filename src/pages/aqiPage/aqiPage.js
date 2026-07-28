// AQIPage Main Container
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES, APP_CONFIG } from '../../config/constants.js';
import { storageService } from '../../services/storageService.js';
import { AQIGaugeSection } from './AQIGaugeSection.js';
import { AQIPollutantsSection } from './AQIPollutantsSection.js';
import { AQIHealthAdviceSection } from './AQIHealthAdviceSection.js';

export const aqiPage = {
  render: async (params = {}) => {
    const city = params.city || storageService.getLastCity() || APP_CONFIG.DEFAULT_CITY;

    return `
      <div class="wp-aqi-page page-wrapper">
        ${Navbar.render(ROUTES.AQI)}

        <main class="container my-4">
          <div class="mb-4">
            <h2 class="font-display wp-text-main mb-1"><i class="bi bi-wind text-info me-2"></i>Chất lượng Không khí (AQI)</h2>
            <p class="wp-text-muted mb-0">Theo dõi nồng độ bụi mịn PM2.5, PM10 và các chỉ số ô nhiễm không khí tại ${city}.</p>
          </div>

          ${await AQIGaugeSection.render(city)}
          ${await AQIPollutantsSection.render(city)}
          ${await AQIHealthAdviceSection.render(city)}
        </main>

        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async () => {
    Navbar.afterRender();
    await AQIGaugeSection.afterRender();
    await AQIPollutantsSection.afterRender();
    await AQIHealthAdviceSection.afterRender();
  }
};
