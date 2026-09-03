// TyphoonDetailPage Main Container — cảnh báo thời tiết nguy hiểm (dữ liệu thật)
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES, APP_CONFIG } from '../../config/constants.js';
import { storageService } from '../../services/storageService.js';
import { alertService } from '../../services/alertService.js';
import { TyphoonBannerSection } from './TyphoonBannerSection.js';
import { TyphoonTrackerSection } from './TyphoonTrackerSection.js';
import { TyphoonActionsSection } from './TyphoonActionsSection.js';
import { TyphoonAffectedAreasSection } from './TyphoonAffectedAreasSection.js';

const emptyState = (city) => `
  <section class="glass-card p-5 text-center my-5">
    <i class="bi bi-shield-check text-success" style="font-size: 3.5rem;"></i>
    <h3 class="font-display mt-3 wp-text-main">Hiện chưa có thông tin về bão / cảnh báo</h3>
    <p class="wp-text-muted mb-4">Không có cảnh báo thời tiết nguy hiểm nào đang hiệu lực tại khu vực <strong>${city}</strong>.</p>
    <a href="#${ROUTES.HOME}" class="btn btn-primary rounded-pill px-4"><i class="bi bi-house-door me-1"></i> Về trang chủ</a>
  </section>
`;

export const typhoonDetailPage = {
  render: async (params = {}) => {
    const city = params.city || storageService.getLastCity() || APP_CONFIG.DEFAULT_CITY;
    const typhoon = await alertService.getTyphoonAlert(city);

    const body = !typhoon
      ? emptyState(city)
      : `
          ${TyphoonBannerSection.render(typhoon)}
          ${await TyphoonTrackerSection.render(city)}
          ${TyphoonActionsSection.render(typhoon)}
          ${TyphoonAffectedAreasSection.render(typhoon)}
        `;

    return `
      <div class="wp-typhoon-page page-wrapper">
        ${Navbar.render(ROUTES.TYPHOON)}
        <main class="container my-4">${body}</main>
        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async (params = {}) => {
    const city = params.city || storageService.getLastCity() || APP_CONFIG.DEFAULT_CITY;
    Navbar.afterRender();
    // Chỉ init bản đồ khi có cảnh báo (phần tử #typhoonMap tồn tại)
    if (document.getElementById('typhoonMap')) {
      await TyphoonTrackerSection.afterRender(city);
    }
  }
};
