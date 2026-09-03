// ForecastChart & Hourly Component (Adaptive Theme)
import { getWeatherIconSvg } from '../utils/formatters.js';
import { themeService } from '../services/themeService.js';

export const ForecastChart = {
  renderHourly: (hourlyData) => {
    return `
      <div class="d-flex gap-2 overflow-x-auto py-2 px-1 custom-scroll">
        ${hourlyData.map(item => `
          <div class="wp-hourly-item flex-shrink-0">
            <span class="small text-muted d-block">${item.time}</span>
            <i class="bi ${getWeatherIconSvg(item.icon)} fs-3 my-2 d-block"></i>
            <span class="fw-bold text-light">${item.temp}°C</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderChartCanvas: (canvasId = 'tempChartCanvas') => {
    return `
      <div class="chart-container mt-3">
        <canvas id="${canvasId}"></canvas>
      </div>
    `;
  },

  initChart: (canvasId, labels, dataPoints) => {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (window.myChartInstance) {
      window.myChartInstance.destroy();
    }

    const isDark = themeService.getTheme() === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';

    window.myChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nhiệt độ (°C)',
          data: dataPoints,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  }
};
