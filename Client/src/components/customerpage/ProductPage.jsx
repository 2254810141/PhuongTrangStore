import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../styles/ShopPage.css'
import { getProducts } from '../../services/productApi'

const PAGE_SIZE = 8

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14h9.96c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21.59 5H6.21l-.94-2H2v2h1.99l3.6 7.59-1.35 2.45A2 2 0 0 0 8 18h12v-2H8l1.17-2z"
      />
    </svg>
  )
}

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

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE)

  const goToPage = (page) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)))
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
        {paginatedProducts.map((item) => (
          <article className="shop-card" key={item.id}>
            <div className="shop-card__media">
              {item.image ? (
                <img className="shop-card__image" src={item.image} alt={item.name} />
              ) : (
                <div className="shop-card__placeholder">No image</div>
              )}
            </div>
            <div className="shop-card__content">
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
                  className="shop-cart-btn"
                  aria-label={`Them ${item.name} vao gio hang`}
                  title="Them vao gio"
                  onClick={() => onAddToCart({ id: item.id, name: item.name, price: item.price })}
                >
                  <CartIcon />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {products.length > 0 && (
        <div className="container pagination" role="navigation" aria-label="Phan trang san pham">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => goToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
          >
            Truoc
          </button>
          <div className="pagination__pages">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`pagination__page ${page === safeCurrentPage ? 'is-active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => goToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </main>
  )
}

export default ProductPage
