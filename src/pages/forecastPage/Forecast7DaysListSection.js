// Forecast7DaysListSection
import { weatherService } from '../../services/weatherService.js';
import { getWeatherIconSvg } from '../../utils/formatters.js';
import { APP_CONFIG } from '../../config/constants.js';

export const Forecast7DaysListSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const list = await weatherService.get7DayForecast(cityName);

    return `
      <section class="glass-card p-4">
        <h5 class="text-light font-display mb-3"><i class="bi bi-calendar-week text-info me-2"></i>Chi tiết thời tiết từng ngày</h5>

        <div class="list-group list-group-flush bg-transparent">
          ${list.map(item => `
            <div class="forecast-day-row d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-3" style="min-width: 180px;">
                <i class="bi ${getWeatherIconSvg(item.icon)} fs-3"></i>
                <div>
                  <span class="fw-bold text-light d-block">${item.day}</span>
                  <small class="text-muted">${item.date}</small>
                </div>
              </div>

              <div class="d-none d-md-block text-muted small">
                <i class="bi bi-umbrella text-info me-1"></i>Xác suất mưa ${item.pop}%
              </div>

              <div class="text-end">
                <span class="fs-5 fw-bold text-light me-2">${item.tempMax}°C</span>
                <span class="text-muted fs-6">${item.tempMin}°C</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  afterRender: async () => {}
};
