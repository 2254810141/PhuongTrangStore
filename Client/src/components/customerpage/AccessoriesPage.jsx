import '../../styles/ShopPage.css'

const accessories = [
  {
    id: 'acc-logi-mx3s',
    name: 'Chuột Logitech MX Master 3S',
    price: 2290000,
    displayPrice: '2.290.000₫',
    desc: 'Chuột không dây cao cấp, phù hợp làm việc văn phòng và thiết kế.',
  },
  {
    id: 'acc-key-k8pro',
    name: 'Bàn phím Keychron K8 Pro',
    price: 2590000,
    displayPrice: '2.590.000₫',
    desc: 'Bàn phím cơ Bluetooth, hot-swap, pin lâu cho coder.',
  },
  {
    id: 'acc-hub-ugreen',
    name: 'Hub USB-C UGREEN 7 in 1',
    price: 990000,
    displayPrice: '990.000₫',
    desc: 'Mở rộng cổng HDMI, USB, SD card cho laptop mỏng nhẹ.',
  },
]

function AccessoriesPage({ onAddToCart = () => {} }) {
  return (
    <main className="shop-page section">
      <div className="container section__header">
        <div>
          <p className="eyebrow">Phụ kiện chính hãng</p>
          <h2>Trang Phụ kiện</h2>
          <p className="muted">Hoàn thiện góc làm việc với phụ kiện chất lượng cao.</p>
        </div>
      </div>

      <div className="container shop-grid">
        {accessories.map((item) => (
          <article className="shop-card" key={item.id}>
            <h3>{item.name}</h3>
            <p className="shop-price">{item.displayPrice}</p>
            <p className="muted">{item.desc}</p>
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

export default AccessoriesPage

