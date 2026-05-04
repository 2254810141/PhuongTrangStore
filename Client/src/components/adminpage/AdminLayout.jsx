import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuthSession } from '../../utils/authSession'
import useAuthSession from '../../hooks/useAuthSession'
import { logoutUser } from '../../services/authApi'
import NotificationBell from '../notification/NotificationBell'

const navItems = [
  { label: 'Quản lý Sản phẩm', to: '/admin/products' },
  { label: 'Quản lý Danh mục', to: '/admin/categories' },
  { label: 'Quản lý Thương hiệu', to: '/admin/brands' },
  { label: 'Quản lý Đơn hàng', to: '/admin/orders' },
]

function AdminLayout() {
  const navigate = useNavigate()
  const { session } = useAuthSession()

  const handleLogout = async () => {
    try {
      await logoutUser(session?.refreshToken)
    } catch {
      // Ignore backend logout errors and still clear local session.
    } finally {
      clearAuthSession()
    }

    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-amber-50 text-zinc-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-zinc-200 bg-amber-900 text-white lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="border-b border-amber-800 p-6">
              <p className="text-lg font-black tracking-wide text-amber-400">PhươngTrang Store</p>
              <p className="mt-1 text-sm text-amber-100">Admin Panel</p>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? 'bg-amber-700 text-white' : 'text-amber-100 hover:bg-amber-800 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-amber-800 p-4">
              <div className="rounded-xl bg-amber-800 p-4">
                <p className="text-xs uppercase tracking-widest text-amber-200">Tài khoản</p>
                <p className="mt-1 text-sm font-semibold text-white">{session?.user?.fullName ?? 'Admin'}</p>
                <p className="text-xs text-amber-100">{session?.user?.email ?? 'admin@phuongtrangstore.vn'}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-lg border border-amber-600 px-3 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-600 hover:text-white"
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
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">PhươngTrang Store - Admin Panel</p>
                <h1 className="mt-1 text-xl font-black text-zinc-900">Bảng điều khiển quản trị</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                  Vai trò: {session?.user?.role ?? 'admin'}
                </div>
                <NotificationBell />
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

