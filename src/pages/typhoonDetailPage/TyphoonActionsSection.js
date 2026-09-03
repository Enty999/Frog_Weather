// TyphoonActionsSection — hướng dẫn ứng phó (từ nội dung cảnh báo thật)
export const TyphoonActionsSection = {
  render: (typhoon) => {
    // Tách hướng dẫn thành từng dòng nếu có xuống dòng
    const steps = (typhoon.instruction || '')
      .split(/\n|\.\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    return `
      <section class="glass-card p-4 mb-4">
        <h5 class="font-display mb-3 wp-text-main">
          <i class="bi bi-shield-exclamation text-warning me-2"></i>Hướng dẫn ứng phó & Khuyến cáo
        </h5>

        ${steps.length ? `
          <ul class="list-group list-group-flush bg-transparent">
            ${steps.map(step => `
              <li class="list-group-item bg-transparent wp-text-main border-secondary border-opacity-25 px-0 d-flex align-items-start gap-2">
                <i class="bi bi-check-circle-fill text-success mt-1"></i>
                <span>${step}</span>
              </li>
            `).join('')}
          </ul>
        ` : `
          <p class="wp-text-muted mb-0"><i class="bi bi-info-circle me-1"></i>Cơ quan khí tượng chưa cung cấp hướng dẫn ứng phó chi tiết cho cảnh báo này.</p>
        `}

        <hr class="border-secondary border-opacity-25 my-3">
        <h6 class="fw-bold mb-2 wp-text-main">Đường dây nóng khẩn cấp:</h6>
        <div class="d-flex flex-wrap gap-3">
          <a href="tel:112" class="text-danger fw-bold text-decoration-none"><i class="bi bi-telephone-fill me-1"></i>112 - Cứu hộ cứu nạn</a>
          <a href="tel:114" class="text-danger fw-bold text-decoration-none"><i class="bi bi-telephone-fill me-1"></i>114 - PCCC</a>
          <a href="tel:115" class="text-danger fw-bold text-decoration-none"><i class="bi bi-telephone-fill me-1"></i>115 - Cấp cứu Y tế</a>
        </div>
      </section>
    `;
  },

  afterRender: async () => {}
};
