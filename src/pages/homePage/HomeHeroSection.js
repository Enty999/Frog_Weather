// HomeHeroSection (Search Bar + Autocomplete gợi ý địa điểm chuẩn z-index)
import { apiClient } from '../../services/apiClient.js';
import { toDisplayName } from '../../config/constants.js';

export const HomeHeroSection = {
  render: async () => {
    return `
      <section class="home-hero-bg text-center">
        <div class="container">
          <h1 class="display-4 font-display fw-extrabold wp-text-main mb-3">
            Khám phá thời tiết thế giới với sự chính xác tuyệt đối
          </h1>
          <p class="lead wp-text-muted max-w-2xl mx-auto mb-4">
            Theo dõi thời gian thực, chỉ số không khí AQI và nhận cảnh báo thiên tai sớm từ siêu bão.
          </p>

          <div class="row justify-content-center">
            <div class="col-md-9 col-lg-7">
              <div class="search-widget-container">
                <form id="homeSearchForm" class="search-box-group">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-search text-primary ms-2 fs-5 search-icon"></i>
                    <input type="text" id="homeSearchInput" class="form-control search-input" placeholder="Nhập tên thành phố (vd: Hà Nội, Đà Lạt, Tokyo)..." required autocomplete="off">
                    <button type="submit" class="btn btn-search-submit rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                      <span>Tìm kiếm</span>
                      <i class="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
                <ul id="searchSuggestions" class="search-suggestions d-none"></ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  afterRender: async () => {
    const form = document.getElementById('homeSearchForm');
    const input = document.getElementById('homeSearchInput');
    const box = document.getElementById('searchSuggestions');
    const container = document.querySelector('.search-widget-container');
    if (!form || !input || !box) return;

    // Kết quả gợi ý gần nhất (để Enter dùng chung nguồn dữ liệu với việc bấm chọn)
    let results = [];

    const goToCity = (city) => {
      // Quy tên chuẩn của API về danh tính tiếng Việt của app (tránh trùng lặp Yêu thích)
      const name = toDisplayName((city || '').trim());
      if (name) window.location.hash = `#/detail?city=${encodeURIComponent(name)}`;
    };

    const hideBox = () => {
      box.classList.add('d-none');
      box.innerHTML = '';
    };

    const renderResults = (list) => {
      if (!list.length) {
        hideBox();
        return;
      }
      box.innerHTML = list.slice(0, 6).map(r => {
        const label = [r.name, r.region, r.country].filter(Boolean).join(' · ');
        return `
          <li class="search-suggestion-item" data-city="${r.name}" title="${label}">
            <i class="bi bi-geo-alt-fill text-primary me-2"></i>
            <span>${label}</span>
          </li>
        `;
      }).join('');
      box.classList.remove('d-none');
    };

    const showNotFound = () => {
      box.innerHTML = `
        <li class="search-suggestion-item text-muted" style="cursor: default;">
          <i class="bi bi-emoji-frown me-2"></i>
          <span>Không tìm thấy địa điểm phù hợp</span>
        </li>
      `;
      box.classList.remove('d-none');
    };

    // Gõ -> gọi search.json (debounce 300ms)
    let timer = null;
    let reqId = 0;
    input.addEventListener('input', () => {
      const term = input.value.trim();
      clearTimeout(timer);
      if (term.length < 2) {
        results = [];
        hideBox();
        return;
      }
      timer = setTimeout(async () => {
        const current = ++reqId;
        const data = await apiClient.search(term);
        if (current !== reqId) return; // bỏ qua kết quả cũ (race)
        results = data;
        renderResults(data);
      }, 300);
    });

    // Enter / nút Tìm kiếm -> LUÔN dùng gợi ý (không dùng chuỗi thô)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const term = input.value.trim();
      if (!term) return;

      // Lấy kết quả mới nhất (phòng khi Enter trước lúc debounce chạy xong)
      const data = await apiClient.search(term);
      results = data;

      if (data.length) {
        goToCity(data[0].name); // gợi ý khớp nhất; nếu chỉ 1 gợi ý cũng chính là nó
      } else {
        showNotFound();
      }
    });

    // Bấm 1 gợi ý
    box.addEventListener('click', (e) => {
      const item = e.target.closest('.search-suggestion-item[data-city]');
      if (!item) return;
      goToCity(item.getAttribute('data-city'));
      hideBox();
    });

    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (container && !container.contains(e.target)) hideBox();
    });
  }
};
