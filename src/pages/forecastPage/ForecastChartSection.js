// ForecastChartSection
import { weatherService } from '../../services/weatherService.js';
import { ForecastChart } from '../../components/ForecastChart.js';
import { APP_CONFIG } from '../../config/constants.js';

export const ForecastChartSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    return `
      <section class="glass-card p-4 mb-4">
        <h5 class="text-light font-display mb-3">
          <i class="bi bi-graph-up-arrow text-primary me-2"></i>Biểu đồ Xu hướng Nhiệt độ (${cityName})
        </h5>
        ${ForecastChart.renderChartCanvas('forecast7DaysChart')}
      </section>
    `;
  },

  afterRender: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const forecast = await weatherService.get7DayForecast(cityName);
    const labels = forecast.map(d => `${d.day} (${d.date})`);
    const temps = forecast.map(d => d.tempMax);
    ForecastChart.initChart('forecast7DaysChart', labels, temps);
  }
};
