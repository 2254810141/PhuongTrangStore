import '../../styles/CartPage.css'

const currency = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

function CartPage({ cartItems = [], onRemoveItem = () => {}, onUpdateQuantity = () => {} }) {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <main className="cart-page section">
      <div className="container section__header">
        <div>
          <p className="eyebrow">Giỏ hàng</p>
          <h2>Thông tin đơn hàng</h2>
          <p className="muted">Kiểm tra sản phẩm trước khi thanh toán.</p>
        </div>
      </div>

      <div className="container cart-shell">
        {cartItems.length === 0 ? (
          <div className="cart-empty">Giỏ hàng đang trống. Hãy thêm sản phẩm để tiếp tục.</div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <article className="cart-row" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p className="muted">{currency.format(item.price)}</p>
                  </div>
                  <div className="qty-control">
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-row__right">
                    <strong>{currency.format(item.price * item.quantity)}</strong>
                    <button type="button" className="link-btn" onClick={() => onRemoveItem(item.id)}>
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <p>Tạm tính</p>
              <h3>{currency.format(subtotal)}</h3>
              <button type="button" className="primary-btn">
                Thanh toán
              </button>
            </aside>
          </>
        )}
      </div>
    </main>
  )
}

export default CartPage

