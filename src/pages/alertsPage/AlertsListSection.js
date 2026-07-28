// AlertsListSection
import { alertService } from '../../services/alertService.js';
import { AlertCard } from '../../components/AlertCard.js';
import { APP_CONFIG } from '../../config/constants.js';

export const AlertsListSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const alerts = await alertService.getActiveAlerts(cityName);

    return `
      <section>
        <h5 class="text-light font-display mb-3"><i class="bi bi-bell-fill text-danger me-2"></i>Danh sách Cảnh báo đang hiệu lực</h5>
        ${alerts.length
          ? alerts.map(a => AlertCard.render(a)).join('')
          : `
            <div class="glass-card p-4 text-center">
              <i class="bi bi-shield-check text-success fs-1"></i>
              <p class="wp-text-main mt-2 mb-0">Hiện chưa có cảnh báo thời tiết nào tại khu vực <strong>${cityName}</strong>.</p>
            </div>
          `}
      </section>
    `;
  },

  afterRender: async () => {}
};
