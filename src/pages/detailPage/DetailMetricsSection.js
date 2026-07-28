// DetailMetricsSection (Fixed UI, Equal Height & Responsive Alignment)
import { weatherService } from '../../services/weatherService.js';
import { APP_CONFIG } from '../../config/constants.js';

export const DetailMetricsSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const data = await weatherService.getCurrentWeather(cityName);

    return `
      <section class="mb-4">
        <h5 class="wp-text-main font-display mb-3"><i class="bi bi-sliders text-info me-2"></i>Chỉ số thời tiết mở rộng</h5>
        <div class="row g-3">
          <!-- Tile 1: UV Index -->
          <div class="col-6 col-md-3">
            <div class="metric-tile h-100">
              <div>
                <span class="wp-text-muted small d-block mb-2">
                  <i class="bi bi-sun-fill text-warning me-1"></i>Chỉ số UV
                </span>
                <div class="d-flex align-items-baseline gap-2">
                  <span class="fs-3 fw-bold wp-text-main">${data.uvIndex}</span>
                  <span class="badge bg-warning text-dark px-2 py-1 fs-6">${data.uvLevel}</span>
                </div>
              </div>
              <small class="wp-text-muted mt-2 d-block">Nguy cơ gây hại</small>
            </div>
          </div>

          <!-- Tile 2: Wind Speed -->
          <div class="col-6 col-md-3">
            <div class="metric-tile h-100">
              <div>
                <span class="wp-text-muted small d-block mb-2">
                  <i class="bi bi-wind text-info me-1"></i>Tốc độ gió
                </span>
                <div class="d-flex align-items-baseline gap-1">
                  <span class="fs-3 fw-bold wp-text-main">${data.windSpeed}</span>
                  <span class="fw-semibold wp-text-muted">km/h</span>
                </div>
              </div>
              <small class="wp-text-muted mt-2 d-block"><i class="bi bi-compass me-1"></i>Hướng: ${data.windDirection || 'Đông'}</small>
            </div>
          </div>

          <!-- Tile 3: Pressure -->
          <div class="col-6 col-md-3">
            <div class="metric-tile h-100">
              <div>
                <span class="wp-text-muted small d-block mb-2">
                  <i class="bi bi-speedometer2 text-primary me-1"></i>Áp suất
                </span>
                <div class="d-flex align-items-baseline gap-1">
                  <span class="fs-3 fw-bold wp-text-main">${data.pressure}</span>
                  <span class="fw-semibold wp-text-muted">hPa</span>
                </div>
              </div>
              <small class="wp-text-muted mt-2 d-block">Áp suất ổn định</small>
            </div>
          </div>

          <!-- Tile 4: Visibility -->
          <div class="col-6 col-md-3">
            <div class="metric-tile h-100">
              <div>
                <span class="wp-text-muted small d-block mb-2">
                  <i class="bi bi-eye-fill text-success me-1"></i>Tầm nhìn
                </span>
                <div class="d-flex align-items-baseline gap-1">
                  <span class="fs-3 fw-bold wp-text-main">${data.visibility}</span>
                  <span class="fw-semibold wp-text-muted">km</span>
                </div>
              </div>
              <small class="wp-text-muted mt-2 d-block">Tầm nhìn tốt</small>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  afterRender: async () => {}
};
