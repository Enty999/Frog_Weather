// DetailHeaderSection
import { weatherService } from '../../services/weatherService.js';
import { WeatherCard } from '../../components/WeatherCard.js';

export const DetailHeaderSection = {
  render: async (cityName = 'Hà Nội') => {
    const data = await weatherService.getCurrentWeather(cityName);
    return `
      <section class="mb-4">
        ${WeatherCard.render(data)}
      </section>
    `;
  },

  afterRender: async () => {
    WeatherCard.afterRender();
  }
};
