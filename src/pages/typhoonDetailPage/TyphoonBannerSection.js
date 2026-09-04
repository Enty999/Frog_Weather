// TyphoonBannerSection — banner cảnh báo (nhận object cảnh báo thật)
export const TyphoonBannerSection = {
  render: (typhoon) => {
    const isDanger = typhoon.severity === 'danger';
    return `
      <section class="glass-card p-4 mb-4 typhoon-banner-card">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <span class="badge ${isDanger ? 'bg-danger' : 'bg-warning text-dark'} fs-6 px-3 py-2 animate-pulse-danger">
            <i class="bi bi-shield-slash-fill me-1"></i> ${typhoon.severityLabel}
          </span>
          <span class="${isDanger ? 'text-danger' : 'text-warning'} fw-bold"><i class="bi bi-broadcast me-1"></i>CẢNH BÁO THỜI TIẾT</span>
        </div>

        <h1 class="display-font text-light fw-extrabold mb-2">${typhoon.name}</h1>
        ${typhoon.desc ? `<p class="lead text-light opacity-90 mb-3">${typhoon.desc}</p>` : ''}

        <div class="row g-3 pt-3 border-top border-danger border-opacity-25">
          ${typhoon.event ? `
          <div class="col-6 col-md-3">
            <small class="text-muted d-block">Loại hình</small>
            <span class="fw-bold text-light">${typhoon.event}</span>
          </div>` : ''}
          ${typhoon.urgency ? `
          <div class="col-6 col-md-3">
            <small class="text-muted d-block">Mức độ khẩn cấp</small>
            <span class="fw-bold text-warning">${typhoon.urgency}</span>
          </div>` : ''}
          ${typhoon.effective ? `
          <div class="col-6 col-md-3">
            <small class="text-muted d-block">Hiệu lực từ</small>
            <span class="fw-bold text-light">${typhoon.effective}</span>
          </div>` : ''}
          ${typhoon.expires ? `
          <div class="col-6 col-md-3">
            <small class="text-muted d-block">Hết hạn</small>
            <span class="fw-bold text-info">${typhoon.expires}</span>
          </div>` : ''}
        </div>
      </section>
    `;
  }
};
