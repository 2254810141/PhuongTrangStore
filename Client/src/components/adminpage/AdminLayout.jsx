import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuthSession } from '../../utils/authSession'
import useAuthSession from '../../hooks/useAuthSession'

const navItems = [
  { label: 'Quản lý Sản phẩm', to: '/admin/products' },
  { label: 'Quản lý Danh mục', to: '/admin/categories' },
  { label: 'Quản lý Thương hiệu', to: '/admin/brands' },
]

function AdminLayout() {
  const navigate = useNavigate()
  const { session } = useAuthSession()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-zinc-200 bg-zinc-950 text-white lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="border-b border-zinc-800 p-6">
              <p className="text-lg font-black tracking-wide text-red-500">PhươngTrang Store</p>
              <p className="mt-1 text-sm text-zinc-300">Admin Panel</p>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? 'bg-red-600 text-white' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-zinc-800 p-4">
              <div className="rounded-xl bg-zinc-900 p-4">
                <p className="text-xs uppercase tracking-widest text-zinc-400">Tài khoản</p>
                <p className="mt-1 text-sm font-semibold text-white">{session?.user?.fullName ?? 'Admin'}</p>
                <p className="text-xs text-zinc-400">{session?.user?.email ?? 'admin@phuongtrangstore.vn'}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-lg border border-red-500 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-600 hover:text-white"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col">
          <header className="border-b border-zinc-200 bg-white px-5 py-4 shadow-sm sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">PhươngTrang Store - Admin Panel</p>
                <h1 className="mt-1 text-xl font-black text-zinc-900">Bảng điều khiển quản trị</h1>
              </div>
              <div className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700">
                Vai trò: {session?.user?.role ?? 'admin'}
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

