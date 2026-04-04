import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/ProductDetail.css'
import { getProductById } from '../../services/productApi'

function ProductDetailPage({ onAddToCart = () => {} }) {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await getProductById(productId)
        if (isMounted) {
          setProduct(data)
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
      <main className="detail-page section">
        <div className="container detail-card">
          <p className="muted">Dang tai thong tin san pham...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="detail-page section">
        <div className="container detail-card">
          <p className="muted">Khong tim thay san pham.</p>
          <Link to="/products/laptop" className="ghost-btn">
            Quay lai danh sach Laptop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="detail-page section">
      <div className="container detail-card">
        <div className="detail-header">
          <div>
            <p className="eyebrow">Laptop nổi bật</p>
            <h1>{product.name}</h1>
            <p className="muted">{product.description}</p>
          </div>
          <div className="detail-price">{product.displayPrice}</div>
        </div>

        {product.image && (
          <div className="detail-media">
            <img src={product.image} alt={product.name} />
          </div>
        )}

        <div className="detail-body">
          <div>
            <h3>Thông số chính</h3>
            <ul className="detail-specs">
              {product.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="detail-actions">
          <Link to="/products/laptop" className="ghost-btn">
            Quay lại danh sách
          </Link>
          <button
            type="button"
            className="primary-btn"
            onClick={() => onAddToCart({ id: product.id, name: product.name, price: product.price })}
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </main>
  )
}

export default ProductDetailPage
