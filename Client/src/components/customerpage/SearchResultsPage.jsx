import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../../services/productApi'
import ProductGrid from './ProductGrid'

const PAGE_SIZE = 8

function SearchResultsPage({ onAddToCart = () => {} }) {
  const [searchParams] = useSearchParams()
  const keyword = (searchParams.get('q') ?? '').trim()

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [keyword])

  useEffect(() => {
    let isMounted = true

    if (!keyword) {
      setProducts([])
      setError('')
      setIsLoading(false)
      return () => {
        isMounted = false
      }
    }

    setIsLoading(true)
    setError('')

    ;(async () => {
      try {
        const productData = await getProducts(keyword)

        if (isMounted) {
          setProducts(productData.filter((item) => item.isActive))
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Không thể tải kết quả tìm kiếm')
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
  }, [keyword])

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <section className="container-app space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">Tìm kiếm</p>
          <h2 className="mt-2 text-2xl font-black text-zinc-900">Kết quả tìm kiếm</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {keyword ? `Từ khóa: "${keyword}"` : 'Nhập từ khóa ở thanh tìm kiếm để bắt đầu.'}
          </p>
        </div>
      </div>

      {isLoading && <div className="text-zinc-500">Đang tìm kiếm...</div>}
      {error && <div className="text-red-700">{error}</div>}

      {!isLoading && !error && keyword && products.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
          Không tìm thấy sản phẩm phù hợp.
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <ProductGrid products={paginatedProducts} onAddToCart={onAddToCart} />

          {products.length > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-2" role="navigation" aria-label="Phân trang kết quả">
              <button
                type="button"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
                onClick={() => setPage(Math.max(1, safePage - 1))}
                disabled={safePage === 1}
              >
                Trước
              </button>
              <span className="text-sm font-semibold text-zinc-600">
                Trang {safePage}/{totalPages}
              </span>
              <button
                type="button"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
                onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                disabled={safePage === totalPages}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default SearchResultsPage

