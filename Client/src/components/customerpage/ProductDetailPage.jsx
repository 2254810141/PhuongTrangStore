import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductById } from '../../services/productApi'

function ProductDetailPage({ onAddToCart = () => {} }) {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await getProductById(productId)
        if (isMounted) {
          setProduct(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Không thể tải chi tiết sản phẩm')
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
  }, [productId])

  if (isLoading) {
    return (
      <section className="container-app rounded-xl border border-zinc-200 bg-white p-8 text-zinc-500 shadow-sm">
        Đang tải thông tin sản phẩm...
      </section>
    )
  }

  if (error) {
    return (
      <section className="container-app space-y-3 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p>{error}</p>
        <Link to="/products" className="font-semibold underline">
          Quay lại danh sách
        </Link>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="container-app space-y-3 rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 shadow-sm">
        <p>Không tìm thấy sản phẩm.</p>
        <Link to="/products" className="font-semibold text-red-700 hover:text-red-800">
          Quay lại danh sách
        </Link>
      </section>
    )
  }

  if (!product.isActive) {
    return (
      <section className="container-app space-y-3 rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 shadow-sm">
        <p>Sản phẩm này hiện không còn hoạt động.</p>
        <Link to="/products" className="font-semibold text-red-700 hover:text-red-800">
          Quay lại danh sách
        </Link>
      </section>
    )
  }

  return (
    <section className="container-app">
      <div className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:grid-cols-2 lg:p-6">
        <div className="space-y-4">
          <div className="text-sm text-zinc-500">
            <Link to="/products" className="font-medium text-zinc-600 hover:text-red-700">
              Sản phẩm
            </Link>{' '}
            / <span className="text-zinc-900">{product.name}</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            <img src={product.image} alt={product.name} className="h-80 w-full object-cover object-center" />
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
            <span className="rounded-full bg-zinc-100 px-3 py-1">Chính hãng</span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">Bảo hành uy tín</span>
            <span className="rounded-full bg-zinc-100 px-3 py-1">Giao nhanh</span>
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="text-2xl font-black text-zinc-900">{product.name}</h1>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Giá bán</p>
            <div className="mt-1 text-3xl font-black text-red-700">{product.displayPrice}</div>
            {product.isContactPrice && <p className="mt-2 text-sm text-zinc-500">Sản phẩm này báo giá theo liên hệ.</p>}
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600 leading-6">
            <p>{product.description?.trim() || 'Chưa có mô tả cho sản phẩm này.'}</p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Quay lại
            </Link>
            {product.isContactPrice ? (
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Liên hệ
              </Link>
            ) : (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                onClick={() => onAddToCart(product)}
              >
                Thêm vào giỏ hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
