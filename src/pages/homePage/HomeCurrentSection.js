// HomeCurrentSection (Full Width 50%-50% Symmetric Layout) — thẻ chỉ hiển thị
import { weatherService } from '../../services/weatherService.js';
import { WeatherCard } from '../../components/WeatherCard.js';

export const HomeCurrentSection = {
  render: async () => {
    const saigonData = await weatherService.getCurrentWeather('TP. Hồ Chí Minh');
    const hanoiData = await weatherService.getCurrentWeather('Hà Nội');

    return `
      <section class="my-4">
        <h4 class="wp-text-main font-display mb-3"><i class="bi bi-geo-alt-fill text-primary me-2"></i>Vị trí hiện tại của bạn</h4>
        <div class="row g-4 align-items-stretch">
          <div class="col-md-6 d-flex">
            ${WeatherCard.render(saigonData, false, { interactive: false })}
          </div>
          <div class="col-md-6 d-flex">
            ${WeatherCard.render(hanoiData, false, { interactive: false })}
          </div>
        </div>
      </section>
    `;
  },

  afterRender: async () => {}
};
