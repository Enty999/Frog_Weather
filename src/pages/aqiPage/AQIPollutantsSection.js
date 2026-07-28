// AQIPollutantsSection
import { weatherService } from '../../services/weatherService.js';
import { APP_CONFIG } from '../../config/constants.js';

export const AQIPollutantsSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const aqiData = await weatherService.getAQI(cityName);
    const p = aqiData.pollutants;

    return `
      <section class="glass-card p-4 mb-4">
        <h5 class="text-light font-display mb-3"><i class="bi bi-activity text-warning me-2"></i>Chi tiết các chất gây ô nhiễm không khí</h5>
        <div class="row g-3">
          <div class="col-6 col-md-4">
            <div class="pollutant-card">
              <span class="text-muted small d-block">${p.pm25.name}</span>
              <span class="fs-3 fw-bold text-warning">${p.pm25.value}</span>
              <small class="text-muted d-block">${p.pm25.unit}</small>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="pollutant-card">
              <span class="text-muted small d-block">${p.pm10.name}</span>
              <span class="fs-3 fw-bold text-success">${p.pm10.value}</span>
              <small class="text-muted d-block">${p.pm10.unit}</small>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="pollutant-card">
              <span class="text-muted small d-block">${p.so2.name}</span>
              <span class="fs-3 fw-bold text-light">${p.so2.value}</span>
              <small class="text-muted d-block">${p.so2.unit}</small>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="pollutant-card">
              <span class="text-muted small d-block">${p.no2.name}</span>
              <span class="fs-3 fw-bold text-light">${p.no2.value}</span>
              <small class="text-muted d-block">${p.no2.unit}</small>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="pollutant-card">
              <span class="text-muted small d-block">${p.o3.name}</span>
              <span class="fs-3 fw-bold text-light">${p.o3.value}</span>
              <small class="text-muted d-block">${p.o3.unit}</small>
            </div>
          </div>
          <div class="col-6 col-md-4">
            <div class="pollutant-card">
              <span class="text-muted small d-block">${p.co.name}</span>
              <span class="fs-3 fw-bold text-light">${p.co.value}</span>
              <small class="text-muted d-block">${p.co.unit}</small>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  afterRender: async () => {}
};
