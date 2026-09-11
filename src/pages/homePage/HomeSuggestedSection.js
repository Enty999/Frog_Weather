// HomeSuggestedSection (Equal Height 3-Card Layout)
import { weatherService } from "../../services/weatherService.js";
import { CompactWeatherCard } from "../../components/CompactWeatherCard.js";

export const HomeSuggestedSection = {
  render: async () => {
    const tokyo = await weatherService.getCurrentWeather("Tokyo");
    const london = await weatherService.getCurrentWeather("London");
    const ny = await weatherService.getCurrentWeather("New York");

    return `
      <section class="mt-5">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h4 class="wp-text-main font-display mb-0"><i class="bi bi-globe me-2 text-info"></i>Thành phố nổi tiếng</h4>
        </div>

        <div class="row g-3 align-items-stretch">
          <div class="col-md-4 d-flex">
            ${new CompactWeatherCard(tokyo, { interactive: false }).render()}
          </div>
          <div class="col-md-4 d-flex">
            ${new CompactWeatherCard(london, { interactive: false }).render()}
          </div>
          <div class="col-md-4 d-flex">
            ${new CompactWeatherCard(ny, { interactive: false }).render()}
          </div>
        </div>
      </section>
    `;
  },

  afterRender: async () => {},
};
