import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/AuthPage.css'
import { registerUser } from '../../services/authApi'

function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp')
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser({
        fullName,
        email,
        password,
        phone: phone.trim() || null,
      })

      navigate('/login', {
        replace: true,
        state: { message: 'Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.' },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Đăng ký</h1>
        <p className="auth-subtitle">Tạo tài khoản để mua sắm dễ dàng hơn tại PhươngTrang Store</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-name">Họ và tên</label>
            <input
              id="register-name"
              type="text"
              name="fullName"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-phone">Số điện thoại</label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              placeholder="Nhập số điện thoại (không bắt buộc)"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Mật khẩu</label>
            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Tạo mật khẩu"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm">Nhập lại mật khẩu</label>
            <input
              id="register-confirm"
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>

        <div className="auth-alt">
          <span>Đã có tài khoản?</span>
          <Link to="/login" className="auth-link">
            Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
