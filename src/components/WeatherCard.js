// WeatherCard Component (Clickable Card Navigation, Full Width & Equal Height)
import { formatTemp, getWeatherIconSvg } from '../utils/formatters.js';
import { storageService } from '../services/storageService.js';

export const WeatherCard = {
  // options.interactive === false -> thẻ chỉ hiển thị (không nút sao, không click chuyển trang)
  render: (weatherData, isCompact = false, options = {}) => {
    const interactive = options.interactive !== false;
    const isFav = storageService.isFavorite(weatherData.name);
    const iconClass = getWeatherIconSvg(weatherData.icon);

    // Chỉ gắn điều hướng/con trỏ khi ở chế độ tương tác
    const navAttrs = interactive
      ? ` cursor-pointer" data-city-card="${weatherData.name}" title="Xem chi tiết thời tiết ${weatherData.name}`
      : '';
    const interactiveClass = interactive ? ' glass-card-interactive' : '';
    const starBtn = interactive ? `
              <button class="favorite-btn btn-fav-toggle" data-city="${weatherData.name}" title="Thêm vào yêu thích">
                <i class="bi ${isFav ? 'bi-star-fill text-warning' : 'bi-star wp-text-muted'} fs-5"></i>
              </button>` : '';

    if (isCompact) {
      return `
        <div class="glass-card${interactiveClass} p-4 wp-weather-card${navAttrs} w-100 h-100 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h4 class="mb-0 fw-bold wp-text-main font-display">${weatherData.name}</h4>
                <small class="wp-text-muted">${weatherData.country}</small>
              </div>${starBtn}
            </div>
            <div class="d-flex align-items-center justify-content-between my-3">
              <span class="temp-display fs-1 fw-bold wp-text-main">${formatTemp(weatherData.temp)}</span>
              <i class="bi ${iconClass}" style="font-size: 3rem;"></i>
            </div>
          </div>
          <div class="pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between text-muted small">
            <span><i class="bi bi-water text-info me-1"></i>Ẩm ${weatherData.humidity}%</span>
            <span><i class="bi bi-wind text-primary me-1"></i>Gió ${weatherData.windSpeed} km/h</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="glass-card p-4 wp-weather-card${navAttrs} w-100 h-100 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h2 class="display-font wp-text-main mb-1">${weatherData.name}</h2>
              <p class="wp-text-muted mb-0"><i class="bi bi-geo-alt me-1"></i>${weatherData.country}</p>
            </div>${starBtn}
          </div>

          <div class="row align-items-center my-3">
            <div class="col-7">
              <div class="temp-display wp-text-main">${formatTemp(weatherData.temp)}</div>
              <p class="text-primary fw-semibold mb-0 mt-1">${weatherData.condition}</p>
            </div>
            <div class="col-5 text-end">
              <i class="bi ${iconClass} weather-icon-lg" style="font-size: 4rem;"></i>
            </div>
          </div>
        </div>

        <div class="row g-2 mt-2 pt-3 border-top border-secondary border-opacity-25 text-center">
          <div class="col-4">
            <small class="wp-text-muted d-block">Cảm giác như</small>
            <span class="fw-semibold wp-text-main">${formatTemp(weatherData.feelsLike || weatherData.temp)}</span>
          </div>
          <div class="col-4">
            <small class="wp-text-muted d-block">Tốc độ gió</small>
            <span class="fw-semibold wp-text-main">${weatherData.windSpeed} km/h</span>
          </div>
          <div class="col-4">
            <small class="wp-text-muted d-block">Độ ẩm</small>
            <span class="fw-semibold wp-text-main">${weatherData.humidity}%</span>
          </div>
        </div>
      </div>
    `;
  },

  afterRender: () => {
    // Nút sao yêu thích (chỉ có trên thẻ tương tác)
    document.querySelectorAll('.btn-fav-toggle').forEach(btn => {
      if (btn.dataset.favBound) return; // tránh gắn trùng khi afterRender chạy nhiều lần
      btn.dataset.favBound = '1';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const city = btn.getAttribute('data-city');
        storageService.toggleFavorite(city);
        const icon = btn.querySelector('i');
        if (storageService.isFavorite(city)) {
          icon.className = 'bi bi-star-fill text-warning fs-5';
        } else {
          icon.className = 'bi bi-star wp-text-muted fs-5';
        }
      });
    });

    // Click cả thẻ để xem chi tiết — chỉ thẻ có data-city-card (loại thẻ chỉ hiển thị)
    document.querySelectorAll('.wp-weather-card[data-city-card]').forEach(card => {
      card.addEventListener('click', () => {
        const cityName = card.getAttribute('data-city-card');
        if (cityName) {
          window.location.hash = `#/detail?city=${encodeURIComponent(cityName)}`;
        }
      });
    });
  }
};
