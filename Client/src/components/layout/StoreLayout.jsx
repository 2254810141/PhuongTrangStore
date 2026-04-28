import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function StoreLayout({ cartCount = 0 }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <Header cartCount={cartCount} />
      <main className="flex-1 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default StoreLayout

