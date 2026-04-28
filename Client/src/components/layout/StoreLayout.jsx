import { Link, Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function StoreLayout({ cartCount = 0 }) {
  const { pathname } = useLocation()
  const showLookupButton = pathname !== '/order-lookup'

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <Header cartCount={cartCount} />
      <main className="flex-1 py-8">
        <Outlet />
      </main>
      {showLookupButton && (
        <Link
          to="/order-lookup"
          aria-label="Tra cứu đơn hàng"
          className="fixed bottom-5 right-5 z-50 inline-flex max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-full bg-red-700 px-5 py-3 text-xs font-bold text-white shadow-xl transition hover:bg-red-800 sm:text-sm"
        >
          <span className="truncate">Tra cứu đơn hàng</span>
        </Link>
      )}
      <Footer />
    </div>
  )
}

export default StoreLayout

