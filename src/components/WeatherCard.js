// Class cha: thẻ thời tiết đầy đủ và hành vi dùng chung cho các loại thẻ.
import { formatTemp, getWeatherIconSvg } from '../utils/formatters.js';
import { storageService } from '../services/storageService.js';
import { favoritesService } from '../services/favoritesService.js';
import { ROUTES } from '../config/constants.js';

export class WeatherCard {
  constructor(weatherData, options = {}) {
    this.weatherData = weatherData;
    this.interactive = options.interactive !== false;
  }

  // Chuẩn bị dữ liệu giao diện dùng chung cho thẻ đầy đủ và thẻ rút gọn.
  getRenderData() {
    const { weatherData, interactive } = this;
    const isFav = favoritesService.isFavorite(weatherData.name);
    const iconClass = getWeatherIconSvg(weatherData.icon);

    // Chỉ gắn điều hướng/con trỏ khi ở chế độ tương tác
    const navAttrs = interactive
      ? ` cursor-pointer" data-city-card="${weatherData.name}" title="Xem chi tiết thời tiết ${weatherData.name}`
      : '';
    const interactiveClass = interactive ? ' glass-card-interactive' : '';
    const starBtn = interactive ? `
              <button class="favorite-btn btn-fav-toggle" type="button" data-city="${weatherData.name}" aria-pressed="${isFav}" title="${isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}">
                <i class="bi ${isFav ? 'bi-star-fill text-warning' : 'bi-star wp-text-muted'} fs-5"></i>
              </button>` : '';

    return { weatherData, iconClass, navAttrs, interactiveClass, starBtn };
  }

  // Hiển thị thẻ đầy đủ; class con sẽ ghi đè phương thức này.
  render() {
    const { weatherData, iconClass, navAttrs, starBtn } = this.getRenderData();

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
  }

  // Dùng chung cho nút sao ở trang chi tiết và danh sách yêu thích.
  static async handleFavoriteClick(btn, onSuccess = () => {}) {
    if (btn.disabled) return;
    if (!storageService.getUser()) {
      window.location.hash = ROUTES.LOGIN;
      return;
    }

    const card = btn.closest('.wp-weather-card');
    card?.querySelector('.favorite-error')?.remove();
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    try {
      const nowFav = await favoritesService.toggleFavorite(btn.getAttribute('data-city'));
      const icon = btn.querySelector('i');
      icon.className = nowFav
        ? 'bi bi-star-fill text-warning fs-5'
        : 'bi bi-star wp-text-muted fs-5';
      btn.setAttribute('aria-pressed', String(nowFav));
      btn.title = nowFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích';
      onSuccess(nowFav);
    } catch (error) {
      const message = document.createElement('p');
      message.className = 'favorite-error text-danger small mt-2 mb-0';
      message.setAttribute('role', 'alert');
      message.textContent = error.message || 'Không cập nhật được yêu thích. Vui lòng thử lại.';
      card?.append(message);
    } finally {
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }
  }

  // Gắn sự kiện cho các thẻ đã có trong DOM, dùng chung cho cả hai class.
  static afterRender() {
    // Nút sao yêu thích (chỉ có trên thẻ tương tác)
    document.querySelectorAll('.btn-fav-toggle').forEach(btn => {
      if (btn.dataset.favBound) return; // tránh gắn trùng khi afterRender chạy nhiều lần
      btn.dataset.favBound = '1';
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();

        await WeatherCard.handleFavoriteClick(btn);
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
}
