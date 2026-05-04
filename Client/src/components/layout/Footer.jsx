import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-amber-700 bg-amber-900 text-amber-100">
      <div className="container-app grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-amber-400">PhươngTrang Store</p>
          <p className="mt-2 text-sm text-amber-200">
            Chuyên dụng cụ cầm tay, máy hàn, máy công trình và vật tư kim khí chính hãng.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-bold uppercase tracking-wide text-amber-50">Danh mục</p>
          <Link to="/products" className="block hover:text-amber-300">
            Tất cả sản phẩm
          </Link>
          <Link to="/contact" className="block hover:text-amber-300">
            Liên hệ tư vấn
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-bold uppercase tracking-wide text-amber-50">Hỗ trợ</p>
          <a href="tel:0909000000" className="block hover:text-amber-300">
            Hotline: 0909 000 000
          </a>
          <a href="mailto:hotro@phuongtrangstore.vn" className="block hover:text-amber-300">
            hotro@phuongtrangstore.vn
          </a>
          <p className="text-amber-200">08:00 - 20:30 (T2 - CN)</p>
        </div>
      </div>

      <div className="border-t border-amber-700 py-4 text-center text-xs text-amber-200">
        <div className="container-app flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 PhươngTrang Store. All rights reserved.</span>
          <span>Giao nhanh nội thành - Hỗ trợ kỹ thuật tận nơi</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

