import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/ShopPage.css'
import { getProducts } from '../../services/productApi'

function ProductPage({ onAddToCart = () => {} }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
          setError(err instanceof Error ? err.message : 'Khong the tai san pham')
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
    return (
      <main className="shop-page section">
        <div className="container">Dang tai san pham...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="shop-page section">
        <div className="container">{error}</div>
      </main>
    )
  }

  return (
    <main className="shop-page section">
      <div className="container section__header">
        <div>
          <p className="eyebrow">Laptop nổi bật</p>
          <h2>Danh sách Laptop</h2>
          <p className="muted">Cấu hình tối ưu cho học tập, lập trình và gaming.</p>
        </div>
      </div>

      <div className="container shop-grid">
        {products.map((item) => (
          <article className="shop-card" key={item.id}>
            {item.image && <img src={item.image} alt={item.name} />}
            <h3>{item.name}</h3>
            <p className="shop-price">{item.displayPrice}</p>
            <ul className="spec-list">
              {item.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
            <div className="shop-actions">
              <Link to={`/products/${item.id}`} className="ghost-btn">
                Xem
              </Link>
              <button
                type="button"
                className="primary-btn"
                onClick={() => onAddToCart({ id: item.id, name: item.name, price: item.price })}
              >
                Thêm vào giỏ
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default ProductPage
