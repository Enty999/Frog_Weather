// DetailRadarSection
import { weatherService } from '../../services/weatherService.js';

export const DetailRadarSection = {
  render: async (cityName = 'Hà Nội') => {
    return `
      <section class="glass-card p-4">
        <h5 class="wp-text-main font-display mb-3"><i class="bi bi-compass text-danger me-2"></i>Bản đồ mây & Mưa vệ tinh (${cityName})</h5>
        <div id="cityRadarMap" class="radar-map-container"></div>
      </section>
    `;
  },

  afterRender: async (cityName = 'Hà Nội') => {
    const mapElement = document.getElementById('cityRadarMap');
    if (!mapElement) return;

    // Reset container if re-rendering map for new city
    if (mapElement._leaflet_id) {
      mapElement._leaflet_id = null;
      mapElement.innerHTML = '';
    }

    const data = await weatherService.getCurrentWeather(cityName);
    const lat = data.lat || 21.0285;
    const lon = data.lon || 105.8542;

    const map = L.map('cityRadarMap').setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
      .bindPopup(`<b>${data.name}</b><br>${data.temp}°C - ${data.condition}`)
      .openPopup();
  }
};
