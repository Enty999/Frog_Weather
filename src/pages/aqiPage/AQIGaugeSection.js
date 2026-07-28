// AQIGaugeSection
import { weatherService } from '../../services/weatherService.js';
import { AQIGauge } from '../../components/AQIGauge.js';
import { APP_CONFIG } from '../../config/constants.js';

export const AQIGaugeSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const aqiData = await weatherService.getAQI(cityName);

    return `
      <section class="glass-card p-4 mb-4">
        <h5 class="text-light font-display text-center mb-2"><i class="bi bi-wind text-info me-2"></i>Tổng quan Chỉ số AQI - ${aqiData.city}</h5>
        ${AQIGauge.render(aqiData)}
      </section>
    `;
  },

  afterRender: async () => {}
};
