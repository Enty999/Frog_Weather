// AlertCard Component
export const AlertCard = {
  render: (alertData) => {
    const isDanger = alertData.severity === 'danger';

    return `
      <div class="glass-card p-3 mb-3 wp-alert-card ${isDanger ? '' : 'warning-level'}">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="badge ${isDanger ? 'bg-danger text-white' : 'bg-warning text-dark'} wp-alert-badge animate-pulse-danger">
            <i class="bi ${isDanger ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'} me-1"></i>
            ${alertData.level}
          </span>
          <small class="text-muted">${alertData.time}</small>
        </div>
        <h5 class="text-light fw-bold mb-1">${alertData.title}</h5>
        <p class="text-muted small mb-2"><i class="bi bi-geo-alt me-1 text-danger"></i>Khu vực: ${alertData.affectedArea}</p>
        <a href="${alertData.link}" class="btn ${isDanger ? 'btn-danger' : 'btn-warning'} btn-sm rounded-pill fw-semibold">
          Xem chi tiết Cảnh báo <i class="bi bi-arrow-right ms-1"></i>
        </a>
      </div>
    `;
  }
};
