import '../../styles/ShopPage.css'

const laptopProducts = [
  {
    id: 'laptop-rog-g16',
    name: 'ROG Zephyrus G16 2025',
    price: 42990000,
    displayPrice: '42.990.000₫',
    specs: ['Intel Core Ultra 9', 'RTX 4070 8GB', '32GB DDR5', '1TB NVMe'],
  },
  {
    id: 'laptop-mbp-m4',
    name: 'MacBook Pro 14" M4',
    price: 54990000,
    displayPrice: '54.990.000₫',
    specs: ['Apple M4 Pro', '14" Liquid Retina XDR', '18GB RAM', '512GB SSD'],
  },
  {
    id: 'laptop-thinkpad-x1',
    name: 'ThinkPad X1 Carbon Gen 13',
    price: 36490000,
    displayPrice: '36.490.000₫',
    specs: ['Intel Core Ultra 7', '16GB LPDDR5X', '1TB SSD', 'Trọng lượng 1.1kg'],
  },
]

function ProductPage({ onAddToCart = () => {} }) {
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
        {laptopProducts.map((item) => (
          <article className="shop-card" key={item.id}>
            <h3>{item.name}</h3>
            <p className="shop-price">{item.displayPrice}</p>
            <ul className="spec-list">
              {item.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
            <button
              type="button"
              className="primary-btn"
              onClick={() => onAddToCart({ id: item.id, name: item.name, price: item.price })}
            >
              Thêm vào giỏ
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}

export default ProductPage

