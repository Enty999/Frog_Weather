// Detail24hSection
import { weatherService } from '../../services/weatherService.js';
import { ForecastChart } from '../../components/ForecastChart.js';

export const Detail24hSection = {
  render: async (cityName = 'Hà Nội') => {
    const hourly = await weatherService.getHourlyForecast(cityName);
    return `
      <section class="glass-card p-4 mb-4">
        <h5 class="wp-text-main font-display mb-3">
          <i class="bi bi-clock-history text-primary me-2"></i>Dự báo 24 giờ tới (${cityName})
        </h5>
        ${ForecastChart.renderHourly(hourly)}
        ${ForecastChart.renderChartCanvas('city24hChart')}
      </section>
    `;
  },

  afterRender: async (cityName = 'Hà Nội') => {
    const hourly = await weatherService.getHourlyForecast(cityName);
    const labels = hourly.map(item => item.time);
    const temps = hourly.map(item => item.temp);
    ForecastChart.initChart('city24hChart', labels, temps);
  }
};
