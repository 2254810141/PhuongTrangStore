import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../../styles/Header.css'

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Laptop', to: '/products/laptop' },
  { label: 'Phụ kiện', to: '/accessories' },
]

function Header() {
  const [open, setOpen] = useState(false)

  const toggleMenu = () => setOpen((prev) => !prev)
  const closeMenu = () => setOpen(false)

  return (
    <header className="site-header">
      <div className="container header__inner">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <span className="brand__mark">SC</span>
          <span className="brand__text">StartComputer</span>
        </NavLink>

        <nav className={`main-nav ${open ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <input
            type="search"
            className="header-search"
            placeholder="Bạn muốn mua gì hôm nay..."
            aria-label="Tìm kiếm sản phẩm"
          />
          <Link to="/cart" className="cart-btn" onClick={closeMenu}>
            Giỏ hàng
          </Link>
          <button className="ghost-btn" type="button">Đăng nhập</button>
          <button className="menu-toggle" type="button" onClick={toggleMenu} aria-label="Mở menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

