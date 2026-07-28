// AQIHealthAdviceSection (Theme-Adaptive Health Advice Items)
import { weatherService } from '../../services/weatherService.js';
import { APP_CONFIG } from '../../config/constants.js';

export const AQIHealthAdviceSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const aqiData = await weatherService.getAQI(cityName);

    return `
      <section class="glass-card p-4">
        <h5 class="font-display mb-3 wp-text-main"><i class="bi bi-heart-pulse text-danger me-2"></i>Lời khuyên Bảo vệ Sức khỏe</h5>
        <div class="d-flex flex-column gap-2">
          ${aqiData.healthAdvice.map(item => `
            <div class="advice-item">
              <i class="bi bi-${item.icon} text-primary fs-3 mt-1"></i>
              <div>
                <h6 class="fw-bold mb-1 wp-text-main">${item.target}</h6>
                <p class="wp-text-muted small mb-0">${item.advice}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  afterRender: async () => {}
};
