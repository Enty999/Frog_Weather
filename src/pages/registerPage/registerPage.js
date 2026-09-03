// RegisterPage — trang đăng ký tài khoản mới (dùng Supabase Auth)
import { Navbar } from '../../components/Navbar.js';
import { Footer } from '../../components/Footer.js';
import { ROUTES } from '../../config/constants.js';
import { authService } from '../../services/authService.js';

export const registerPage = {
  // Tái dùng class CSS của trang đăng nhập (wp-login-page, login-card, ...)
  render: async () => {
    return `
      <div class="wp-login-page page-wrapper">
        ${Navbar.render(ROUTES.REGISTER)}

        <main class="container my-auto py-5 d-flex justify-content-center">
          <div class="login-card">
            <div class="login-logo-icon">
              <i class="bi bi-person-plus-fill text-white fs-2"></i>
            </div>

            <h3 class="text-center font-display fw-bold mb-1 wp-text-main">Tạo tài khoản WeatherPulse</h3>
            <p class="text-center wp-text-muted small mb-4">Đăng ký để lưu địa điểm yêu thích của bạn</p>

            <div id="registerError" class="alert alert-danger py-2 px-3 small d-none" role="alert">
              <i class="bi bi-exclamation-circle me-1"></i><span id="registerErrorText"></span>
            </div>

            <form id="registerForm">
              <div class="mb-3">
                <label class="form-label wp-text-muted small">Địa chỉ Email</label>
                <div class="input-group">
                  <span class="input-group-text wp-input text-muted"><i class="bi bi-envelope"></i></span>
                  <input type="email" id="registerEmail" class="form-control wp-input" placeholder="user@weatherpulse.com" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label wp-text-muted small">Mật khẩu</label>
                <div class="input-group">
                  <span class="input-group-text wp-input text-muted"><i class="bi bi-lock"></i></span>
                  <input type="password" id="registerPassword" class="form-control wp-input" placeholder="Ít nhất 6 ký tự" required>
                  <button type="button" id="togglePassword" class="input-group-text wp-input text-muted" style="cursor: pointer;" title="Hiện/ẩn mật khẩu" aria-label="Hiện hoặc ẩn mật khẩu">
                    <i class="bi bi-eye" id="togglePasswordIcon"></i>
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label wp-text-muted small">Xác nhận mật khẩu</label>
                <div class="input-group">
                  <span class="input-group-text wp-input text-muted"><i class="bi bi-lock-fill"></i></span>
                  <input type="password" id="registerConfirmPassword" class="form-control wp-input" placeholder="••••••••" required>
                  <button type="button" id="toggleConfirmPassword" class="input-group-text wp-input text-muted" style="cursor: pointer;" title="Hiện/ẩn mật khẩu" aria-label="Hiện hoặc ẩn mật khẩu xác nhận">
                    <i class="bi bi-eye" id="toggleConfirmPasswordIcon"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2 rounded-pill fw-bold">
                Đăng ký ngay <i class="bi bi-arrow-right me-1"></i>
              </button>
            </form>

            <p class="text-center wp-text-muted small mt-4 mb-0">
              Đã có tài khoản?
              <a href="#${ROUTES.LOGIN}" class="fw-semibold text-decoration-none">Đăng nhập</a>
            </p>
          </div>
        </main>

        ${Footer.render()}
      </div>
    `;
  },

  afterRender: async () => {
    Navbar.afterRender();

    const pwdInput = document.getElementById('registerPassword');
    const confirmInput = document.getElementById('registerConfirmPassword');

    // Gắn nút ẩn/hiện độc lập cho từng ô mật khẩu
    const bindToggle = (btnId, iconId, input) => {
      const btn = document.getElementById(btnId);
      const icon = document.getElementById(iconId);
      if (!btn || !icon || !input) return;
      btn.addEventListener('click', () => {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        icon.className = isHidden ? 'bi bi-eye-slash' : 'bi bi-eye';
      });
    };
    bindToggle('togglePassword', 'togglePasswordIcon', pwdInput);
    bindToggle('toggleConfirmPassword', 'toggleConfirmPasswordIcon', confirmInput);

    // Xử lý đăng ký
    const form = document.getElementById('registerForm');
    const errorBox = document.getElementById('registerError');
    const errorText = document.getElementById('registerErrorText');

    const showError = (message) => {
      errorText.textContent = message;
      errorBox.classList.remove('d-none');
    };

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.classList.add('d-none');

        const email = document.getElementById('registerEmail').value;
        const password = pwdInput.value;
        const confirmPassword = confirmInput.value;

        // Kiểm tra phía client trước khi gọi API
        if (password.length < 6) {
          showError('Mật khẩu phải có ít nhất 6 ký tự.');
          return;
        }
        if (password !== confirmPassword) {
          showError('Mật khẩu xác nhận không khớp.');
          return;
        }

        // Vô hiệu hóa nút gửi để tránh double-submit trong lúc chờ mạng
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const result = await authService.register(email, password);

        if (result.ok) {
          window.location.hash = ROUTES.HOME;
          window.location.reload();
        } else {
          showError(result.error);
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }
  }
};
