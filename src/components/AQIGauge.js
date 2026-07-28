// AQIGauge Component
export const AQIGauge = {
  render: (aqiData) => {
    let colorClass = 'wp-aqi-good';
    if (aqiData.score > 50 && aqiData.score <= 100) colorClass = 'wp-aqi-moderate';
    if (aqiData.score > 100 && aqiData.score <= 150) colorClass = 'wp-aqi-unhealthy';
    if (aqiData.score > 150) colorClass = 'wp-aqi-hazardous';

    return `
      <div class="text-center py-3">
        <div class="wp-aqi-circle ${colorClass}">
          <span class="wp-aqi-value">${aqiData.score}</span>
          <small class="fw-bold text-uppercase" style="font-size: 0.75rem;">AQI US</small>
        </div>
        <h4 class="mt-3 text-light font-display">${aqiData.status}</h4>
        <p class="text-muted small mb-0">Chất lượng không khí hiện tại ở khu vực của bạn.</p>
      </div>
    `;
  }
};
