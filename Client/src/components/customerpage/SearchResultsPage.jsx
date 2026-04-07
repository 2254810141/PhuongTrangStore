import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import '../../styles/ShopPage.css'
import { getProducts } from '../../services/productApi'
import { getAccessories } from '../../services/accessoryApi'

const PAGE_SIZE = 8

function SearchResultsPage({ onAddToCart = () => {} }) {
  const [searchParams] = useSearchParams()
  const keyword = (searchParams.get('q') ?? '').trim()

  const [products, setProducts] = useState([])
  const [accessories, setAccessories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [productPage, setProductPage] = useState(1)
  const [accessoryPage, setAccessoryPage] = useState(1)

  useEffect(() => {
    setProductPage(1)
    setAccessoryPage(1)
  }, [keyword])

  useEffect(() => {
    let isMounted = true

    if (!keyword) {
      setProducts([])
      setAccessories([])
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
        const [productData, accessoryData] = await Promise.all([
          getProducts(keyword),
          getAccessories(keyword),
        ])

        if (isMounted) {
          setProducts(productData.filter((item) => item.isActive))
          setAccessories(accessoryData.filter((item) => item.isActive))
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

  const hasResults = products.length > 0 || accessories.length > 0
  const productTotalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const safeProductPage = Math.min(productPage, productTotalPages)
  const productStartIndex = (safeProductPage - 1) * PAGE_SIZE
  const paginatedProducts = products.slice(productStartIndex, productStartIndex + PAGE_SIZE)

  const accessoryTotalPages = Math.max(1, Math.ceil(accessories.length / PAGE_SIZE))
  const safeAccessoryPage = Math.min(accessoryPage, accessoryTotalPages)
  const accessoryStartIndex = (safeAccessoryPage - 1) * PAGE_SIZE
  const paginatedAccessories = accessories.slice(accessoryStartIndex, accessoryStartIndex + PAGE_SIZE)

  return (
    <main className="shop-page section">
      <div className="container section__header">
        <div>
          <p className="eyebrow">Tìm kiếm</p>
          <h2>Kết quả tìm kiếm</h2>
          <p className="muted">{keyword ? `Từ khóa: "${keyword}"` : 'Nhập từ khóa ở thanh tìm kiếm để bắt đầu.'}</p>
        </div>
      </div>

      {isLoading && <div className="container">Đang tìm kiếm...</div>}
      {error && <div className="container">{error}</div>}

      {!isLoading && !error && keyword && !hasResults && (
        <div className="container search-empty">Không tìm thấy sản phẩm hoặc phụ kiện phù hợp.</div>
      )}

      {!isLoading && !error && hasResults && (
        <>
          {products.length > 0 && (
            <section className="container search-section">
              <h3 className="search-section__title">Laptop ({products.length})</h3>
              <div className="shop-grid">
                {paginatedProducts.map((item) => (
                  <article className="shop-card" key={`p-${item.id}`}>
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
                        {item.specs.slice(0, 3).map((spec) => (
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
                          aria-label={`Thêm ${item.name} vào giỏ hàng`}
                          title="Thêm vào giỏ"
                          onClick={() => onAddToCart({ id: item.id, name: item.name, price: item.price })}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {products.length > PAGE_SIZE && (
                <div className="pagination" role="navigation" aria-label="Phan trang ket qua laptop">
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => setProductPage(Math.max(1, safeProductPage - 1))}
                    disabled={safeProductPage === 1}
                  >
                    Truoc
                  </button>
                  <div className="pagination__pages">
                    {Array.from({ length: productTotalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={`product-page-${page}`}
                        type="button"
                        className={`pagination__page ${page === safeProductPage ? 'is-active' : ''}`}
                        onClick={() => setProductPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => setProductPage(Math.min(productTotalPages, safeProductPage + 1))}
                    disabled={safeProductPage === productTotalPages}
                  >
                    Sau
                  </button>
                </div>
              )}
            </section>
          )}

          {accessories.length > 0 && (
            <section className="container search-section">
              <h3 className="search-section__title">Phụ kiện ({accessories.length})</h3>
              <div className="shop-grid">
                {paginatedAccessories.map((item) => (
                  <article className="shop-card" key={`a-${item.id}`}>
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
                      <p className="muted shop-card__desc">{item.desc}</p>
                      <div className="shop-actions">
                        <Link to={`/accessories/${item.id}`} className="ghost-btn">
                          Xem
                        </Link>
                        <button
                          type="button"
                          className="shop-cart-btn"
                          aria-label={`Thêm ${item.name} vào giỏ hàng`}
                          title="Thêm vào giỏ"
                          onClick={() => onAddToCart({ id: item.id, name: item.name, price: item.price })}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {accessories.length > PAGE_SIZE && (
                <div className="pagination" role="navigation" aria-label="Phan trang ket qua phu kien">
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => setAccessoryPage(Math.max(1, safeAccessoryPage - 1))}
                    disabled={safeAccessoryPage === 1}
                  >
                    Truoc
                  </button>
                  <div className="pagination__pages">
                    {Array.from({ length: accessoryTotalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={`accessory-page-${page}`}
                        type="button"
                        className={`pagination__page ${page === safeAccessoryPage ? 'is-active' : ''}`}
                        onClick={() => setAccessoryPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => setAccessoryPage(Math.min(accessoryTotalPages, safeAccessoryPage + 1))}
                    disabled={safeAccessoryPage === accessoryTotalPages}
                  >
                    Sau
                  </button>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default SearchResultsPage

