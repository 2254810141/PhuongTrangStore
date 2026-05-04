import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCategories } from '../../services/categoryApi'
import { getBrands } from '../../services/brandApi'
import useAuthSession from '../../hooks/useAuthSession'
import { clearAuthSession } from '../../utils/authSession'
import { logoutUser } from '../../services/authApi'

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: '/products' },
]

function Header({ cartCount = 0 }) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openBrandDropdown, setOpenBrandDropdown] = useState(false)
  const [openAccountMenu, setOpenAccountMenu] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [brandList, setBrandList] = useState([])
  const { session } = useAuthSession()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    // Lấy danh mục từ backend để hiển thị nhanh ở menu mobile.
    ;(async () => {
      try {
        const data = await getCategories()
        if (mounted) {
          setCategoryList(data.filter((item) => item.isActive).slice(0, 6))
        }
      } catch {
        if (mounted) {
          setCategoryList([])
        }
      }
    })()

    ;(async () => {
      try {
        const data = await getBrands()
        if (mounted) {
          setBrandList(data.filter((item) => item.isActive))
        }
      } catch {
        if (mounted) {
          setBrandList([])
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const keyword = searchKeyword.trim()
    navigate(keyword ? `/search?q=${encodeURIComponent(keyword)}` : '/search')
    setOpenMobileMenu(false)
  }

  const categoryCount = useMemo(
    () => categoryList.length,
    [categoryList],
  )

  const brandCount = useMemo(() => brandList.length, [brandList])
  const userName = session?.user?.fullName?.trim() || session?.user?.email || 'Tài khoản'

  const handleLogout = async () => {
    try {
      await logoutUser(session?.refreshToken)
    } catch {
      // Ignore backend logout errors and still clear local session.
    } finally {
      clearAuthSession()
    }

    setOpenAccountMenu(false)
    setOpenMobileMenu(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-amber-700 bg-amber-900 text-white shadow-panel">
      <div className="w-full px-4 xl:px-8">
        <div className="flex flex-nowrap items-center gap-6 py-4 xl:gap-8">
          <Link to="/" className="group flex shrink-0 items-center gap-3 whitespace-nowrap">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-700 text-lg font-black">
              PT
            </span>
            <div>
              <p className="whitespace-nowrap text-lg font-extrabold tracking-wide text-amber-500">PhươngTrang Store</p>
              <p className="whitespace-nowrap text-xs uppercase tracking-widest text-amber-200">
                Dụng cụ cầm tay - thiết bị cơ khí
              </p>
            </div>
          </Link>

          <nav className="hidden flex-nowrap items-center gap-6 whitespace-nowrap lg:flex xl:gap-8">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${isActive ? 'text-amber-400' : 'text-amber-100 hover:text-amber-300'}`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
            >
              <button
                type="button"
                className="inline-flex whitespace-nowrap items-center gap-2 text-sm font-semibold text-amber-100 transition hover:text-amber-300"
              >
                Danh mục
                <span className="text-xs text-amber-200">({categoryCount})</span>
              </button>

              {openDropdown && (
                <div className="absolute left-0 top-full z-50 w-[780px] pt-2">
                  <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-amber-700 bg-amber-800 p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2">
                      {categoryList.length > 0 ? (
                        categoryList.map((category) => (
                          <Link
                            key={category.id}
                            to={`/category/${category.id}`}
                            className="rounded-lg border border-amber-700 bg-amber-900 px-3 py-2 text-sm text-amber-100 transition hover:border-amber-500 hover:text-white"
                          >
                            {category.name}
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full rounded-lg border border-amber-700 bg-amber-900 px-3 py-2 text-sm text-amber-200">
                          Chưa có danh mục nào.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenBrandDropdown(true)}
              onMouseLeave={() => setOpenBrandDropdown(false)}
            >
              <button
                type="button"
                className="inline-flex whitespace-nowrap items-center gap-2 text-sm font-semibold text-amber-100 transition hover:text-amber-300"
              >
                Thương hiệu
                <span className="text-xs text-amber-200">({brandCount})</span>
              </button>

              {openBrandDropdown && (
                <div className="absolute left-0 top-full z-50 w-[520px] pt-2">
                  <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-amber-700 bg-amber-800 p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {brandList.length > 0 ? (
                        brandList.map((brand) => (
                          <Link
                            key={brand.id}
                            to={`/brand/${brand.id}`}
                            className="rounded-lg border border-amber-700 bg-amber-900 px-3 py-2 text-sm text-amber-100 transition hover:border-amber-500 hover:text-white"
                          >
                            {brand.name}
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full rounded-lg border border-amber-700 bg-amber-900 px-3 py-2 text-sm text-amber-200">
                          Chưa có thương hiệu nào.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <form onSubmit={handleSearchSubmit} className="ml-auto hidden w-full min-w-[240px] max-w-xl flex-1 lg:block">
            <input
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm dụng cụ, máy hàn, đá mài..."
              className="w-full rounded-lg border border-amber-700 bg-amber-800 px-4 py-2 text-sm text-amber-50 outline-none placeholder:text-amber-200 focus:border-amber-500"
            />
          </form>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              to="/cart"
              className="relative whitespace-nowrap rounded-lg border border-amber-700 px-3 py-2 text-sm font-semibold text-amber-50 transition hover:border-amber-500"
            >
              Giỏ hàng
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setOpenAccountMenu((prev) => !prev)}
                className="inline-flex max-w-[220px] items-center gap-2 whitespace-nowrap rounded-lg bg-amber-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-black uppercase">
                  {userName.charAt(0)}
                </span>
                <span className="truncate">{session ? userName : 'Tài khoản'}</span>
              </button>

              {openAccountMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-amber-700 bg-amber-800 p-2 shadow-xl">
                  {session ? (
                    <>
                      <div className="border-b border-amber-700 px-3 py-2 text-sm">
                        <p className="font-semibold text-white">{userName}</p>
                        <p className="text-xs text-amber-200">{session.user?.email}</p>
                      </div>
                      <Link
                        to="/checkout"
                        onClick={() => setOpenAccountMenu(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-amber-100 transition hover:bg-amber-700"
                      >
                        Thanh toán
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setOpenAccountMenu(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-amber-100 transition hover:bg-amber-700"
                      >
                        Lịch sử đặt hàng
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setOpenAccountMenu(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-amber-100 transition hover:bg-amber-700"
                      >
                        Liên hệ
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-amber-300 transition hover:bg-amber-700"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setOpenAccountMenu(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-amber-100 transition hover:bg-amber-700"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setOpenAccountMenu(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-amber-100 transition hover:bg-amber-700"
                      >
                        Đăng ký
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setOpenAccountMenu(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-amber-100 transition hover:bg-amber-700"
                      >
                        Liên hệ
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="inline-flex rounded-lg border border-amber-700 p-2 lg:hidden"
              onClick={() => setOpenMobileMenu((prev) => !prev)}
              aria-label="Mở menu"
            >
              <span className="h-0.5 w-5 bg-white" />
            </button>
          </div>
        </div>

        {openMobileMenu && (
          <div className="space-y-4 border-t border-amber-700 pb-4 pt-4 lg:hidden">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm sản phẩm"
                className="w-full rounded-lg border border-amber-700 bg-amber-800 px-4 py-2 text-sm text-amber-50 outline-none"
              />
            </form>

            <div className="grid gap-2">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpenMobileMenu(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-800"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="rounded-lg border border-amber-700 bg-amber-800 p-3">
              <button
                type="button"
                onClick={() => setOpenAccountMenu((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg border border-amber-700 px-3 py-2 text-sm font-semibold text-amber-50"
              >
                <span>{session ? userName : 'Tài khoản'}</span>
                <span className="text-xs text-amber-200">{session ? 'Đã đăng nhập' : 'Đăng nhập / Đăng ký'}</span>
              </button>

              {openAccountMenu && (
                <div className="mt-3 space-y-1">
                  {session ? (
                    <>
                      <Link
                        to="/checkout"
                        onClick={() => setOpenMobileMenu(false)}
                        className="block rounded bg-amber-700 px-3 py-2 text-sm text-amber-100"
                      >
                        Thanh toán
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setOpenMobileMenu(false)}
                        className="block rounded bg-amber-700 px-3 py-2 text-sm text-amber-100"
                      >
                        Lịch sử đặt hàng
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setOpenMobileMenu(false)}
                        className="block rounded bg-amber-700 px-3 py-2 text-sm text-amber-100"
                      >
                        Liên hệ
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full rounded bg-amber-700 px-3 py-2 text-left text-sm text-amber-300"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setOpenMobileMenu(false)}
                        className="block rounded bg-amber-700 px-3 py-2 text-sm text-amber-100"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setOpenMobileMenu(false)}
                        className="block rounded bg-amber-700 px-3 py-2 text-sm text-amber-100"
                      >
                        Đăng ký
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setOpenMobileMenu(false)}
                        className="block rounded bg-amber-700 px-3 py-2 text-sm text-amber-100"
                      >
                        Liên hệ
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-amber-700 bg-amber-800 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-300">Danh mục nổi bật</p>
              <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1">
                {categoryList.length > 0 ? (
                  categoryList.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      onClick={() => setOpenMobileMenu(false)}
                      className="rounded bg-amber-700 px-2 py-1 text-xs text-amber-100"
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full rounded bg-amber-700 px-2 py-1 text-xs text-amber-200">
                    Chưa có danh mục nào.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-amber-700 bg-amber-800 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-300">Thương hiệu nổi bật</p>
              <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                {brandList.length > 0 ? (
                  brandList.map((brand) => (
                    <Link
                      key={brand.id}
                      to={`/brand/${brand.id}`}
                      onClick={() => setOpenMobileMenu(false)}
                      className="rounded bg-amber-700 px-2 py-1 text-xs text-amber-100"
                    >
                      {brand.name}
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full rounded bg-amber-700 px-2 py-1 text-xs text-amber-200">
                    Chưa có thương hiệu nào.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
