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
          <p className="muted">Đang tải thông tin sản phẩm...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="detail-page section">
        <div className="container detail-card">
          <p className="muted">Không tìm thấy sản phẩm.</p>
          <Link to="/products/laptop" className="ghost-btn">
            Quay lại danh sách Laptop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="detail-page section">
      <div className="container detail-layout">
        <div className="detail-media-card">
          <div className="detail-breadcrumb">
            <Link to="/products/laptop">Laptop</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>

          {product.image ? (
            <div className="detail-media">
              <img src={product.image} alt={product.name} />
            </div>
          ) : (
            <div className="detail-media detail-media--empty">No image</div>
          )}

          <div className="detail-feature-row">
            <span className="detail-chip">Chính hãng 100%</span>
            <span className="detail-chip">Bảo hành uy tín</span>
            <span className="detail-chip">Giao nhanh toàn quốc</span>
          </div>
        </div>

        <div className="detail-info-card">
          <p className="eyebrow">Laptop nổi bật</p>
          <h1>{product.name}</h1>
          <p className="muted detail-summary">{product.description}</p>

          <div className="detail-price-block">
            <span className="detail-price-label">Giá bán</span>
            <div className="detail-price">{product.displayPrice}</div>
          </div>

          <div className="detail-meta-grid">
            <div className="detail-meta-item">
              <span>Tồn kho</span>
              <strong>{product.stockQuantity}</strong>
            </div>
            <div className="detail-meta-item">
              <span>Trạng thái</span>
              <strong>{product.isActive ? 'Đang kinh doanh' : 'Tạm ngừng'}</strong>
            </div>
          </div>

          <div className="detail-section">
            <h3>Thông số chính</h3>
            <ul className="detail-specs">
              {product.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
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
      </div>
    </main>
  )
}

export default ProductDetailPage
