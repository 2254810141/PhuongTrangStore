import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../../styles/AuthPage.css'
import { loginUser } from '../../services/authApi'
import { saveAuthSession } from '../../utils/authSession'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const successMessage = location.state?.message ?? ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await loginUser({ email, password })

      saveAuthSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt,
        user: response.user,
      })

      const redirectTo = location.state?.from?.pathname ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Đăng nhập</h1>
        <p className="auth-subtitle">Chào mừng bạn quay lại PhươngTrang Store</p>

        {successMessage && <p className="auth-success">{successMessage}</p>}
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="auth-forgot">
            <Link to="/forgot-password" className="auth-link">
              Quên mật khẩu?
            </Link>
          </div>

          <div className="auth-actions">
            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        <div className="auth-alt">
          <span>Chưa có tài khoản?</span>
          <Link to="/register" className="auth-link">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
