// DetailPage Main Container
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES } from '../../config/constants.js';
import { storageService } from '../../services/storageService.js';
import { DetailHeaderSection } from './DetailHeaderSection.js';
import { Detail24hSection } from './Detail24hSection.js';
import { DetailMetricsSection } from './DetailMetricsSection.js';
import { DetailRadarSection } from './DetailRadarSection.js';

export const detailPage = {
  render: async (params = {}) => {
    const city = params.city ? decodeURIComponent(params.city) : (storageService.getLastCity() || 'Hà Nội');
    storageService.setLastCity(city);

    return `
      <div class="wp-detail-page page-wrapper">
        ${Navbar.render(ROUTES.DETAIL)}

        <main class="container my-4">
          ${await DetailHeaderSection.render(city)}
          ${await Detail24hSection.render(city)}
          ${await DetailMetricsSection.render(city)}
          ${await DetailRadarSection.render(city)}
        </main>

        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async (params = {}) => {
    const city = params.city ? decodeURIComponent(params.city) : (storageService.getLastCity() || 'Hà Nội');
    Navbar.afterRender();
    await DetailHeaderSection.afterRender(city);
    await Detail24hSection.afterRender(city);
    await DetailMetricsSection.afterRender(city);
    await DetailRadarSection.afterRender(city);
  }
};
