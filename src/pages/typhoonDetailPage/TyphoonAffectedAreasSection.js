// TyphoonAffectedAreasSection — thông tin khu vực & chi tiết cảnh báo thật
export const TyphoonAffectedAreasSection = {
  render: (typhoon) => {
    const rows = [
      ['Khu vực ảnh hưởng', typhoon.areas],
      ['Loại hình', typhoon.event],
      ['Mức độ nghiêm trọng', typhoon.severityLabel],
      ['Mức độ khẩn cấp', typhoon.urgency],
      ['Độ chắc chắn', typhoon.certainty],
      ['Phân loại', typhoon.category],
      ['Hiệu lực từ', typhoon.effective],
      ['Hết hạn', typhoon.expires]
    ].filter(([, value]) => value);

    return `
      <section class="glass-card p-4">
        <h5 class="font-display mb-3 wp-text-main">
          <i class="bi bi-geo-alt-fill text-danger me-2"></i>Chi tiết khu vực chịu ảnh hưởng
        </h5>
        <div class="table-responsive">
          <table class="table wp-table table-hover mb-0 align-middle">
            <tbody>
              ${rows.map(([label, value]) => `
                <tr>
                  <td class="fw-bold wp-text-main" style="width: 40%;">${label}</td>
                  <td class="wp-text-main">${value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  afterRender: async () => {}
};
