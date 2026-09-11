// Class con: thẻ thời tiết rút gọn dùng tại mục Thành phố nổi tiếng.
import { WeatherCard } from './WeatherCard.js';
import { formatTemp } from '../utils/formatters.js';

export class CompactWeatherCard extends WeatherCard {
  constructor(weatherData, options = {}) {
    // Gọi constructor cha để khởi tạo dữ liệu và tùy chọn tương tác.
    super(weatherData, options);
  }

  // Ghi đè render() của class cha, tái sử dụng phần chuẩn bị dữ liệu được kế thừa.
  render() {
    const { weatherData, iconClass, navAttrs, interactiveClass, starBtn } = this.getRenderData();

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
}
