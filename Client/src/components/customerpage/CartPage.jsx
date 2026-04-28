const currency = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

function CartPage({ cartItems = [], onRemoveItem = () => {}, onUpdateQuantity = () => {} }) {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <section className="container-app space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">Giỏ hàng</p>
          <h2 className="mt-2 text-2xl font-black text-zinc-900">Thông tin đơn hàng</h2>
          <p className="mt-2 text-sm text-zinc-500">Kiểm tra số lượng trước khi thanh toán.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {cartItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
            Giỏ hàng đang trống. Hãy thêm sản phẩm để tiếp tục.
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <article
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  key={item.id}
                >
                  <div>
                    <h3 className="font-semibold text-zinc-900">{item.name}</h3>
                    <p className="text-sm text-zinc-500">{currency.format(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-auto">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3 sm:ml-6">
                    <strong>{currency.format(item.price * item.quantity)}</strong>
                    <button
                      type="button"
                      className="text-sm font-semibold text-red-700 transition hover:text-red-800"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">Tạm tính</p>
              <h3 className="mt-2 text-2xl font-black text-zinc-900">{currency.format(subtotal)}</h3>
              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Thanh toán
              </button>
            </aside>
          </>
        )}
      </div>
    </section>
  )
}

export default CartPage

