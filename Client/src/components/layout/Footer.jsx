import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      <div className="container-app grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-red-500">PhươngTrang Store</p>
          <p className="mt-2 text-sm text-zinc-400">
            Chuyên dụng cụ cầm tay, máy hàn, máy công trình và vật tư kim khí chính hãng.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-bold uppercase tracking-wide text-zinc-100">Danh mục</p>
          <Link to="/products" className="block hover:text-red-400">
            Tất cả sản phẩm
          </Link>
          <Link to="/category/khoan-pin" className="block hover:text-red-400">
            Dụng cụ dùng pin
          </Link>
          <Link to="/category/han-mig" className="block hover:text-red-400">
            Máy hàn và cắt
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-bold uppercase tracking-wide text-zinc-100">Hỗ trợ</p>
          <a href="tel:0909000000" className="block hover:text-red-400">
            Hotline: 0909 000 000
          </a>
          <a href="mailto:hotro@phuongtrangstore.vn" className="block hover:text-red-400">
            hotro@phuongtrangstore.vn
          </a>
          <p className="text-zinc-500">08:00 - 20:30 (T2 - CN)</p>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        <div className="container-app flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 PhươngTrang Store. All rights reserved.</span>
          <span>Giao nhanh nội thành - Hỗ trợ kỹ thuật tận nơi</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

