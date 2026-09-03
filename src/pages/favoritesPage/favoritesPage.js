// FavoritesPage (Full-Sized Rich Weather Cards Grid)
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES } from '../../config/constants.js';
import { storageService } from '../../services/storageService.js';
import { favoritesService } from '../../services/favoritesService.js';
import { weatherService } from '../../services/weatherService.js';
import { WeatherCard } from '../../components/WeatherCard.js';

// Markup trạng thái "chưa có địa điểm nào" — tách riêng để tái sử dụng khi xóa hết
const emptyStateMarkup = () => `
  <div id="favEmptyState" class="glass-card p-5 text-center my-5">
    <i class="bi bi-star text-muted display-1"></i>
    <h4 class="font-display mt-3 wp-text-main">Chưa có địa điểm yêu thích nào</h4>
    <p class="wp-text-muted">Hãy tìm kiếm địa điểm rồi bấm biểu tượng ngôi sao ở trang chi tiết để thêm vào danh sách theo dõi.</p>
    <a href="#/" class="btn btn-primary rounded-pill px-4 mt-2">Khám phá Trang chủ</a>
  </div>
`;

export const favoritesPage = {
  render: async () => {
    // Guard: chưa đăng nhập -> màn hình khóa, không gọi API
    if (!storageService.getUser()) {
      return `
        <div class="wp-favorites-page page-wrapper">
          ${Navbar.render(ROUTES.FAVORITES)}
          <main class="container my-4">
            <div class="glass-card p-5 text-center my-5">
              <i class="bi bi-lock-fill text-warning display-1"></i>
              <h4 class="font-display mt-3 wp-text-main">Vui lòng đăng nhập</h4>
              <p class="wp-text-muted">Bạn cần đăng nhập để xem và quản lý danh sách địa điểm yêu thích.</p>
              <a href="#${ROUTES.LOGIN}" class="btn btn-primary rounded-pill px-4 mt-2">
                <i class="bi bi-box-arrow-in-right me-1"></i> Đăng nhập ngay
              </a>
            </div>
          </main>
          ${Footer.render()}
        </div>
      `;
    }

    // Nạp danh sách yêu thích mới nhất từ Supabase vào cache, rồi lấy ra
    await favoritesService.load();
    const favCities = favoritesService.getFavorites();
    // Lấy thời tiết thật cho từng thành phố; allSettled để 1 thành phố lỗi không làm vỡ trang
    const results = await Promise.allSettled(
      favCities.map(city => weatherService.getCurrentWeather(city))
    );
    const weatherByCity = {};
    favCities.forEach((city, i) => {
      if (results[i].status === 'fulfilled') weatherByCity[city] = results[i].value;
    });

    return `
      <div class="wp-favorites-page page-wrapper">
        ${Navbar.render(ROUTES.FAVORITES)}

        <main class="container my-4">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 class="font-display wp-text-main mb-1"><i class="bi bi-star-fill text-warning me-2"></i>Địa điểm yêu thích</h2>
              <p class="wp-text-muted mb-0">Danh sách các địa điểm thời tiết bạn quan tâm và lưu trữ.</p>
            </div>
          </div>

          ${favCities.length === 0 ? emptyStateMarkup() : `
            <div id="favGrid" class="row g-4 align-items-stretch">
              ${favCities.map(cityName => {
                const data = weatherByCity[cityName] || { name: cityName, country: '', temp: 0, humidity: 0, windSpeed: 0, icon: 'cloud', condition: 'Không có dữ liệu' };
                return `
                  <div class="col-md-6 col-lg-4 fav-grid-item d-flex">
                    ${WeatherCard.render(data, false)}
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </main>

        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async () => {
    Navbar.afterRender();

    // Tự xử lý nút sao của lưới này (async): đánh dấu favBound TRƯỚC để WeatherCard bỏ qua
    // phần toggle, tránh 2 listener chạy chồng nhau. Trên trang này bỏ sao = gỡ thẻ.
    document.querySelectorAll('#favGrid .btn-fav-toggle').forEach(btn => {
      btn.dataset.favBound = '1';
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const city = btn.getAttribute('data-city');
        const nowFav = await favoritesService.toggleFavorite(city);
        if (!nowFav) {
          const item = btn.closest('.fav-grid-item');
          if (item) item.remove();
          const grid = document.getElementById('favGrid');
          if (grid && grid.querySelectorAll('.fav-grid-item').length === 0) {
            grid.outerHTML = emptyStateMarkup();
          }
        }
      });
    });

    // Gọi sau để WeatherCard chỉ bind click điều hướng cho thẻ (nút sao đã favBound)
    WeatherCard.afterRender();
  }
};
