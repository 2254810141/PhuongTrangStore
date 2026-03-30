import '../../styles/Footer.css'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="brand__mark">SC</div>
          <div>
            <p className="footer__title">StartComputer</p>
            <p className="footer__muted">Laptop chính hãng, giao nhanh toàn quốc.</p>
          </div>
        </div>

        <div className="footer__links">
          <p className="footer__label">Danh mục</p>
          <Link to="/products/laptop">Laptop</Link>
          <Link to="/accessories">Phụ kiện</Link>
          <Link to="/">Khuyến mãi</Link>
        </div>

        <div className="footer__links">
          <p className="footer__label">Hỗ trợ</p>
          <a href="tel:19001234">Hotline: 1900 1234</a>
          <a href="mailto:support@startcomputer.vn">support@startcomputer.vn</a>
          <span className="footer__muted">08:00 - 21:00 (T2 - CN)</span>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© 2025 StartComputer. All rights reserved.</span>
        <span className="footer__muted">CSKH 24/7 - Giao nhanh nội thành</span>
      </div>
    </footer>
  )
}

export default Footer

