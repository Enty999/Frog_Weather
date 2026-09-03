// TyphoonTrackerSection — bản đồ khu vực cảnh báo (center theo thành phố)
import { weatherService } from '../../services/weatherService.js';
import { APP_CONFIG } from '../../config/constants.js';

export const TyphoonTrackerSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    return `
      <section class="glass-card p-4 mb-4">
        <h5 class="text-light font-display mb-3">
          <i class="bi bi-radar text-danger me-2"></i>Bản đồ khu vực cảnh báo (${cityName})
        </h5>
        <div id="typhoonMap" class="typhoon-map-wrapper"></div>
      </section>
    `;
  },

  afterRender: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const mapElement = document.getElementById('typhoonMap');
    if (!mapElement) return;
    if (mapElement._leaflet_id) return;

    const data = await weatherService.getCurrentWeather(cityName);
    const lat = data.lat != null ? data.lat : 16.0544;
    const lon = data.lon != null ? data.lon : 108.2022;

    const map = L.map('typhoonMap').setView([lat, lon], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    L.circleMarker([lat, lon], {
      color: 'red',
      fillColor: '#ef4444',
      fillOpacity: 0.5,
      radius: 20
    }).addTo(map).bindPopup(`<b class="text-danger">${data.name}</b><br>Khu vực có cảnh báo`).openPopup();
  }
};
