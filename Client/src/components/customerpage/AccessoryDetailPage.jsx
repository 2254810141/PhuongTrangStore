import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/ProductDetail.css'
import { getAccessoryById } from '../../services/accessoryApi'

function AccessoryDetailPage({ onAddToCart = () => {} }) {
  const { accessoryId } = useParams()
  const [accessory, setAccessory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await getAccessoryById(accessoryId)
        if (isMounted) {
          setAccessory(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Không thể tải thông tin phụ kiện')
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
  }, [accessoryId])

  if (isLoading) {
    return (
      <main className="detail-page section">
        <div className="container detail-card">
          <p className="muted">Đang tải thông tin phụ kiện...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="detail-page section">
        <div className="container detail-card">
          <p className="muted">{error}</p>
          <Link to="/accessories" className="ghost-btn">
            Quay lại danh sách Phụ kiện
          </Link>
        </div>
      </main>
    )
  }

  if (!accessory) {
    return (
      <main className="detail-page section">
        <div className="container detail-card">
          <p className="muted">Không tìm thấy phụ kiện.</p>
          <Link to="/accessories" className="ghost-btn">
            Quay lại danh sách Phụ kiện
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
            <Link to="/accessories">Phụ kiện</Link>
            <span>/</span>
            <span>{accessory.name}</span>
          </div>

          {accessory.image ? (
            <div className="detail-media">
              <img src={accessory.image} alt={accessory.name} />
            </div>
          ) : (
            <div className="detail-media detail-media--empty">No image</div>
          )}

          <div className="detail-feature-row">
            <span className="detail-chip">Phụ kiện chính hãng</span>
            <span className="detail-chip">Bảo hành uy tín</span>
            <span className="detail-chip">Đổi trả dễ dàng</span>
          </div>
        </div>

        <div className="detail-info-card">
          <p className="eyebrow">Phụ kiện chính hãng</p>
          <h1>{accessory.name}</h1>
          <p className="muted detail-summary">{accessory.desc}</p>

          <div className="detail-price-block">
            <span className="detail-price-label">Giá bán</span>
            <div className="detail-price">{accessory.displayPrice}</div>
          </div>

          <div className="detail-meta-grid">
            <div className="detail-meta-item">
              <span>Tồn kho</span>
              <strong>{accessory.stockQuantity}</strong>
            </div>
            <div className="detail-meta-item">
              <span>Trạng thái</span>
              <strong>{accessory.isActive ? 'Đang kinh doanh' : 'Tạm ngừng'}</strong>
            </div>
          </div>

          <div className="detail-section">
            <h3>Thông tin nổi bật</h3>
            <ul className="detail-specs">
              {accessory.details?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-actions">
            <Link to="/accessories" className="ghost-btn">
              Quay lại danh sách
            </Link>
            <button
              type="button"
              className="primary-btn"
              onClick={() => onAddToCart({ id: accessory.id, name: accessory.name, price: accessory.price })}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AccessoryDetailPage
