// Footer Component
export const Footer = {
  render: () => {
    return `
      <footer class="wp-footer py-4 mt-auto">
        <div class="container text-center text-md-start">
          <div class="row gy-3 align-items-center">
            <div class="col-md-6">
              <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                <i class="bi bi-cloud-sun-fill text-primary fs-5"></i>
                <span class="fw-bold text-light">WeatherPulse</span>
              </div>
              <p class="mb-0 text-muted small">Nền tảng dự báo thời tiết thông minh & cảnh báo thiên tai khẩn cấp cho người Việt.</p>
            </div>
            <div class="col-md-6 text-center text-md-end">
              <div class="d-flex gap-3 justify-content-center justify-content-md-end mb-2">
                <a href="#/" class="text-muted text-decoration-none">Trang chủ</a>
                <a href="#/alerts" class="text-warning text-decoration-none">Cảnh báo bão</a>
                <a href="#/aqi" class="text-muted text-decoration-none">Chất lượng không khí</a>
              </div>
              <p class="mb-0 text-muted small">&copy; 2026 WeatherPulse. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};
