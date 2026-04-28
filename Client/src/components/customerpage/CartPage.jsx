import Swal from 'sweetalert2'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const currency = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

function CartPage({ cartItems = [], onRemoveItem = () => {}, onUpdateQuantity = () => {} }) {
  const navigate = useNavigate()
  const [selectedProductIds, setSelectedProductIds] = useState([])

  useEffect(() => {
    setSelectedProductIds((prev) => prev.filter((id) => cartItems.some((item) => String(item.id) === String(id))))
  }, [cartItems])

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedProductIds.some((id) => String(id) === String(item.id))),
    [cartItems, selectedProductIds],
  )

  const subtotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length

  const toggleItem = (itemId) => {
    setSelectedProductIds((prev) => {
      const id = String(itemId)
      return prev.some((value) => String(value) === id)
        ? prev.filter((value) => String(value) !== id)
        : [...prev, itemId]
    })
  }

  const toggleSelectAll = () => {
    setSelectedProductIds(isAllSelected ? [] : cartItems.map((item) => item.id))
  }

  const handleDecreaseQuantity = async (item) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1)
      return
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xóa sản phẩm khỏi giỏ hàng?',
      text: `Số lượng của "${item.name}" sẽ về 0. Bạn có muốn xóa sản phẩm này không?`,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626',
    })

    if (result.isConfirmed) {
      onRemoveItem(item.id)
    }
  }

  const handleRemoveItem = async (item) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xóa sản phẩm?',
      text: `Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng không?`,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626',
    })

    if (result.isConfirmed) {
      onRemoveItem(item.id)
    }
  }

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
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-zinc-300 text-red-700 focus:ring-red-600"
                  />
                  Chọn tất cả
                </label>
                <span className="text-xs text-zinc-500">Đã chọn {selectedItems.length}/{cartItems.length} sản phẩm</span>
              </div>

              {cartItems.map((item) => (
                <article
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  key={item.id}
                >
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.some((id) => String(id) === String(item.id))}
                      onChange={() => toggleItem(item.id)}
                      className="h-4 w-4 rounded border-zinc-300 text-red-700 focus:ring-red-600"
                    />
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">{item.name}</h3>
                      <p className="text-sm text-zinc-500">{currency.format(item.price)}</p>
                    </div>
                  </label>

                  <div className="flex items-center gap-2 sm:ml-auto">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-md border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100"
                      onClick={() => handleDecreaseQuantity(item)}
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
                      onClick={() => handleRemoveItem(item)}
                    >
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">Tạm tính cho sản phẩm đã chọn</p>
              <h3 className="mt-2 text-2xl font-black text-zinc-900">{currency.format(subtotal)}</h3>
              <button
                type="button"
                disabled={selectedItems.length === 0}
                onClick={() => navigate('/checkout', { state: { selectedProductIds: selectedItems.map((item) => Number(item.id)) } })}
                className="mt-4 w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Thanh toán {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
              </button>
              <Link
                to="/contact"
                className="mt-3 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
              >
                Liên hệ tư vấn
              </Link>
            </aside>
          </>
        )}
      </div>
    </section>
  )
}

export default CartPage

