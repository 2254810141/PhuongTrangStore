import { useEffect, useState } from 'react'
import { getProducts } from '../../services/productApi'
import ProductGrid from './ProductGrid'

const PAGE_SIZE = 8

function ProductPage({ onAddToCart = () => {} }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await getProducts()
        if (isMounted) {
          setProducts(data.filter((item) => item.isActive))
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <section className="container-app">Đang tải sản phẩm...</section>
  }

  if (error) {
    return <section className="container-app text-red-700">{error}</section>
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE)

  const goToPage = (page) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)))
  }

  return (
    <section className="container-app space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">Tất cả sản phẩm</p>
          <h2 className="mt-2 text-2xl font-black text-zinc-900">Danh sách dụng cụ và thiết bị</h2>
          <p className="mt-2 text-sm text-zinc-500">Chỉ hiển thị sản phẩm đang hoạt động (IsActive = true).</p>
        </div>
      </div>

      <ProductGrid products={paginatedProducts} onAddToCart={onAddToCart} />

      {products.length > 0 && (
        <div className="flex items-center justify-center gap-2" role="navigation" aria-label="Phân trang sản phẩm">
          <button
            type="button"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
            onClick={() => goToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
          >
            Trước
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`h-9 min-w-9 rounded-md border px-3 text-sm font-semibold transition ${
                  page === safeCurrentPage
                    ? 'border-red-700 bg-red-700 text-white'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
            onClick={() => goToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </section>
  )
}

export default ProductPage
