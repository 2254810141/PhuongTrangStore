import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../services/productApi'
import ProductGrid from './ProductGrid'
import { getCategories } from '../../services/categoryApi'
import BannerPopup from './BannerPopup'
import ZaloButton from './ZaloButton'

function HomePage({ onAddToCart = () => {} }) {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const [productData, categoryData] = await Promise.all([getProducts(), getCategories()])
        if (mounted) {
          setFeatured(productData.filter((item) => item.isActive).slice(0, 8))
          setCategories(categoryData.filter((item) => item.isActive).slice(0, 6))
        }
      } catch {
        if (mounted) {
          setFeatured([])
          setCategories([])
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <div className="space-y-10">
        <BannerPopup />
        <section className="container-app overflow-hidden rounded-2xl bg-amber-200 text-zinc-900 shadow-panel">
          <div className="grid gap-8 bg-brand-grid bg-grid p-8 lg:grid-cols-2 lg:p-10">
            <div className="lg:col-span-2 overflow-hidden rounded-xl">
              <img
                src="https://res.cloudinary.com/djbupbycd/image/upload/v1777999107/banner1_nj1g6x.png"
                alt="Banner Kim Khí Tuấn Ngọc"
                className="h-58 w-full object-cover object-center lg:h-58"
              />
            </div>
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-amber-700 bg-amber-600 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                Kim Khí Tuấn Ngọc
              </span>
              <h1 className="text-3xl font-black leading-tight text-zinc-900 lg:text-4xl">
                Dụng cụ cầm tay và thiết bị cơ khí chính hãng cho thợ chuyên nghiệp
              </h1>
              <p className="text-sm text-zinc-600 lg:text-base">
                Chuyên DCK, DCA, Weldcom... giá cạnh tranh, hỗ trợ kỹ thuật, giao nhanh toàn quốc.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="rounded-lg bg-amber-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
                >
                  Xem tất cả sản phẩm
                </Link>
                <Link
                  to="/products"
                  className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-bold text-zinc-700 transition hover:border-amber-600 hover:text-amber-600"
                >
                  Xem danh mục
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs text-zinc-500 sm:grid-cols-3">
                <div>Hàng chính hãng có hóa đơn VAT</div>
                <div>Tư vấn đúng máy theo nhu cầu</div>
                <div>Hỗ trợ bảo hành nhanh</div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-400 bg-amber-100 p-5">
              <p className="text-xs uppercase tracking-widest text-amber-700">Danh mục sản phẩm</p>
              <div className="mt-4 space-y-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="flex items-center justify-between rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm transition hover:border-amber-500 hover:bg-amber-50"
                    >
                      <span className="text-zinc-700">{category.name}</span>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-zinc-500">
                    Chưa có danh mục nào.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="container-app space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Sản phẩm nổi bật</p>
              <h2 className="text-2xl font-black text-zinc-900">Bán chạy tại cửa hàng</h2>
            </div>
            <Link to="/products" className="text-sm font-semibold text-amber-700 hover:text-amber-800">
              Xem tất cả -&gt;
            </Link>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500 shadow-sm">
              Đang tải sản phẩm...
            </div>
          ) : (
            <ProductGrid products={featured} onAddToCart={onAddToCart} />
          )}
        </section>

      </div>
      <ZaloButton />
    </>
  )
}

export default HomePage
