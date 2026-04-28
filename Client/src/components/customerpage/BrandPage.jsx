import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from './ProductGrid'
import { getProducts } from '../../services/productApi'
import { getBrands } from '../../services/brandApi'

const PAGE_SIZE = 8

function BrandPage({ onAddToCart = () => {} }) {
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [brandName, setBrandName] = useState('Thương hiệu')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [id])

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const [productData, brandData] = await Promise.all([getProducts(), getBrands()])
        if (!isMounted) return

        const normalizedId = Number(id)
        const selectedBrand = brandData.find((item) => String(item.id) === String(id))
        const filtered = productData.filter((item) => {
          if (!item.isActive) return false
          if (Number.isNaN(normalizedId)) return false
          return item.brandId === normalizedId
        })

        setBrandName(selectedBrand?.name ?? 'Thương hiệu')
        setProducts(filtered)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Không thể tải thương hiệu')
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
  }, [id])

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE)

  const goToPage = (page) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)))
  }

  const title = useMemo(() => brandName, [brandName])

  if (isLoading) {
    return <section className="container-app">Đang tải thương hiệu...</section>
  }

  if (error) {
    return <section className="container-app text-red-700">{error}</section>
  }

  return (
    <section className="container-app space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600">Thương hiệu</p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">{title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Tìm thấy {products.length} sản phẩm đang kinh doanh.</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
          Thương hiệu này chưa có sản phẩm.
        </div>
      ) : (
        <>
          <ProductGrid products={paginatedProducts} onAddToCart={onAddToCart} />

          {products.length > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-2" role="navigation" aria-label="Phân trang thương hiệu">
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
        </>
      )}
    </section>
  )
}

export default BrandPage

