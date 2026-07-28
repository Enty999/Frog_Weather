// AlertsHeatmapSection — bản đồ khu vực (center theo thành phố + đánh dấu khi có cảnh báo)
import { weatherService } from '../../services/weatherService.js';
import { alertService } from '../../services/alertService.js';
import { APP_CONFIG } from '../../config/constants.js';

export const AlertsHeatmapSection = {
  render: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    return `
      <section class="glass-card p-4 mb-4">
        <h5 class="text-light font-display mb-3">
          <i class="bi bi-map-fill text-warning me-2"></i>Bản đồ Cảnh báo Thiên tai (${cityName})
        </h5>
        <div id="alertsMap" class="alert-map-box"></div>
      </section>
    `;
  },

  afterRender: async (cityName = APP_CONFIG.DEFAULT_CITY) => {
    const mapElement = document.getElementById('alertsMap');
    if (!mapElement) return;
    if (mapElement._leaflet_id) return;

    const data = await weatherService.getCurrentWeather(cityName);
    const alerts = await alertService.getActiveAlerts(cityName);
    const lat = data.lat != null ? data.lat : 16.0544;
    const lon = data.lon != null ? data.lon : 108.2022;

    const map = L.map('alertsMap').setView([lat, lon], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Đánh dấu khu vực: đỏ nếu có cảnh báo, xanh nếu an toàn
    const hasAlert = alerts.length > 0;
    L.circleMarker([lat, lon], {
      color: hasAlert ? 'red' : 'green',
      fillColor: hasAlert ? '#ef4444' : '#22c55e',
      fillOpacity: 0.5,
      radius: 20
    }).addTo(map).bindPopup(
      hasAlert
        ? `<b class="text-danger">${data.name}</b><br>Có ${alerts.length} cảnh báo đang hiệu lực`
        : `<b>${data.name}</b><br>Không có cảnh báo`
    ).openPopup();
  }
};
