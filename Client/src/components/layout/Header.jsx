import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { categoryMenu } from '../../constants/menuCategories'
import { getCategories } from '../../services/categoryApi'
import { getBrands } from '../../services/brandApi'

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: '/products' },
]

function Header({ cartCount = 0 }) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openBrandDropdown, setOpenBrandDropdown] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [brandList, setBrandList] = useState([])
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
    () => categoryMenu.reduce((sum, group) => sum + group.children.length, 0),
    [],
  )

  const brandCount = useMemo(() => brandList.length, [brandList])

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950 text-white shadow-panel">
      <div className="w-full px-4 xl:px-8">
        <div className="flex flex-nowrap items-center gap-6 py-4 xl:gap-8">
          <Link to="/" className="group flex shrink-0 items-center gap-3 whitespace-nowrap">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-700 text-lg font-black">
              PT
            </span>
            <div>
              <p className="whitespace-nowrap text-lg font-extrabold tracking-wide text-red-500">PhươngTrang Store</p>
              <p className="whitespace-nowrap text-xs uppercase tracking-widest text-zinc-400">
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
                  `text-sm font-semibold transition ${isActive ? 'text-red-500' : 'text-zinc-200 hover:text-red-400'}`
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
                className="inline-flex whitespace-nowrap items-center gap-2 text-sm font-semibold text-zinc-200 transition hover:text-red-400"
              >
                Danh mục
                <span className="text-xs text-zinc-400">({categoryCount})</span>
              </button>

              {openDropdown && (
                <div className="absolute left-0 top-full z-50 w-[780px] pt-2">
                  <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-4">
                      {categoryMenu.map((group) => (
                        <div key={group.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                          <Link
                            to={`/category/${group.id}`}
                            className="mb-2 block text-sm font-bold uppercase tracking-wide text-red-400"
                          >
                            {group.label}
                          </Link>
                          <div className="space-y-1">
                            {group.children.map((child) => (
                              <Link
                                key={child.id}
                                to={`/category/${child.id}`}
                                className="block rounded px-2 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
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
                className="inline-flex whitespace-nowrap items-center gap-2 text-sm font-semibold text-zinc-200 transition hover:text-red-400"
              >
                Thương hiệu
                <span className="text-xs text-zinc-400">({brandCount})</span>
              </button>

              {openBrandDropdown && (
                <div className="absolute left-0 top-full z-50 w-[520px] pt-2">
                  <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {brandList.length > 0 ? (
                        brandList.map((brand) => (
                          <Link
                            key={brand.id}
                            to={`/brand/${brand.id}`}
                            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 transition hover:border-red-500 hover:text-white"
                          >
                            {brand.name}
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
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
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-red-500"
            />
          </form>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              to="/cart"
              className="relative whitespace-nowrap rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-100 transition hover:border-red-500"
            >
              Giỏ hàng
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/login"
              className="hidden whitespace-nowrap rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800 lg:inline-flex"
            >
              Đăng nhập
            </Link>

            <button
              type="button"
              className="inline-flex rounded-lg border border-zinc-700 p-2 lg:hidden"
              onClick={() => setOpenMobileMenu((prev) => !prev)}
              aria-label="Mở menu"
            >
              <span className="h-0.5 w-5 bg-white" />
            </button>
          </div>
        </div>

        {openMobileMenu && (
          <div className="space-y-4 border-t border-zinc-800 pb-4 pt-4 lg:hidden">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm sản phẩm"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 outline-none"
              />
            </form>

            <div className="grid gap-2">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpenMobileMenu(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-400">Danh mục nổi bật</p>
              <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1">
                {categoryList.length > 0
                  ? categoryList.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        onClick={() => setOpenMobileMenu(false)}
                        className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200"
                      >
                        {category.name}
                      </Link>
                    ))
                  : categoryMenu.flatMap((group) =>
                      group.children.map((child) => (
                        <Link
                          key={child.id}
                          to={`/category/${child.id}`}
                          onClick={() => setOpenMobileMenu(false)}
                          className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200"
                        >
                          {child.label}
                        </Link>
                      )),
                    )}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-400">Thương hiệu nổi bật</p>
              <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                {brandList.length > 0 ? (
                  brandList.map((brand) => (
                    <Link
                      key={brand.id}
                      to={`/brand/${brand.id}`}
                      onClick={() => setOpenMobileMenu(false)}
                      className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200"
                    >
                      {brand.name}
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
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
