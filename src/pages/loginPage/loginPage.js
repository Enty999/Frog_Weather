// LoginPage
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES } from '../../config/constants.js';
import { authService } from '../../services/authService.js';

export const loginPage = {
  render: async () => {
    return `
      <div class="wp-login-page page-wrapper">
        ${Navbar.render(ROUTES.LOGIN)}

        <main class="container my-auto py-5 d-flex justify-content-center">
          <div class="login-card">
            <div class="login-logo-icon">
              <i class="bi bi-cloud-sun-fill text-white fs-2"></i>
            </div>

            <h3 class="text-center font-display fw-bold mb-1 wp-text-main">Đăng nhập WeatherPulse</h3>
            <p class="text-center wp-text-muted small mb-4">Cập nhật thông tin thời tiết cá nhân hóa</p>

            <div id="loginError" class="alert alert-danger py-2 px-3 small d-none" role="alert">
              <i class="bi bi-exclamation-circle me-1"></i><span id="loginErrorText"></span>
            </div>

            <form id="loginForm">
              <div class="mb-3">
                <label class="form-label wp-text-muted small">Địa chỉ Email</label>
                <div class="input-group">
                  <span class="input-group-text wp-input text-muted"><i class="bi bi-envelope"></i></span>
                  <input type="email" id="loginEmail" class="form-control wp-input" placeholder="user@weatherpulse.com" required>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label wp-text-muted small">Mật khẩu</label>
                <div class="input-group">
                  <span class="input-group-text wp-input text-muted"><i class="bi bi-lock"></i></span>
                  <input type="password" id="loginPassword" class="form-control wp-input" placeholder="••••••••" required>
                  <button type="button" id="togglePassword" class="input-group-text wp-input text-muted" style="cursor: pointer;" title="Hiện/ẩn mật khẩu" aria-label="Hiện hoặc ẩn mật khẩu">
                    <i class="bi bi-eye" id="togglePasswordIcon"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2 rounded-pill fw-bold">
                Đăng nhập ngay <i class="bi bi-arrow-right me-1"></i>
              </button>
            </form>

            <p class="text-center wp-text-muted small mt-4 mb-0">
              Chưa có tài khoản?
              <a href="#${ROUTES.REGISTER}" class="fw-semibold text-decoration-none">Đăng ký</a>
            </p>
          </div>
        </main>

        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async () => {
    Navbar.afterRender();

    // Nút ẩn/hiện mật khẩu
    const toggleBtn = document.getElementById('togglePassword');
    const pwdInput = document.getElementById('loginPassword');
    const toggleIcon = document.getElementById('togglePasswordIcon');
    if (toggleBtn && pwdInput && toggleIcon) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = pwdInput.type === 'password';
        pwdInput.type = isHidden ? 'text' : 'password';
        toggleIcon.className = isHidden ? 'bi bi-eye-slash' : 'bi bi-eye';
      });
    }

    // Xử lý đăng nhập
    const form = document.getElementById('loginForm');
    const errorBox = document.getElementById('loginError');
    const errorText = document.getElementById('loginErrorText');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.classList.add('d-none');

        const email = document.getElementById('loginEmail').value;
        const password = pwdInput.value;

        // Vô hiệu hóa nút gửi để tránh double-submit trong lúc chờ mạng
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const result = await authService.login(email, password);
        if (result.ok) {
          window.location.hash = ROUTES.HOME;
          window.location.reload();
        } else {
          errorText.textContent = result.error;
          errorBox.classList.remove('d-none');
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }
  }
};
