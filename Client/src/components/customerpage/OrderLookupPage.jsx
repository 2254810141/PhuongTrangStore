import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { lookupOrdersByEmail } from '../../services/orderApi'
import { formatVnd, PLACEHOLDER_IMAGE, toAbsoluteImageUrl } from '../../utils/product'

const statusLabelMap = {
  draft: 'Bản nháp',
  pending_confirm: 'Chờ xác nhận',
  pending_payment: 'Chờ thanh toán',
  confirmed: 'Đã thanh toán',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  expired: 'Đã hết hạn',
}

const statusClassMap = {
  draft: 'bg-zinc-100 text-zinc-700',
  pending_confirm: 'bg-amber-100 text-amber-700',
  pending_payment: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  shipping: 'bg-sky-100 text-sky-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-zinc-100 text-zinc-600',
}

function OrderLookupPage() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchedEmail, setSearchedEmail] = useState('')

  const totalOrders = useMemo(() => orders.length, [orders])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      await Swal.fire({
        icon: 'warning',
        title: 'Vui lòng nhập email',
        text: 'Bạn cần nhập email đã dùng để đặt hàng.',
      })
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await lookupOrdersByEmail({ email: normalizedEmail })
      setOrders(data)
      setSearchedEmail(normalizedEmail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tra cứu đơn hàng')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="container-app space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Order lookup</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900">Tra cứu đơn hàng</h1>
        <p className="mt-2 text-sm text-zinc-500">Nhập email bạn đã dùng khi đặt hàng để xem lại danh sách đơn hàng.</p>

        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Nhập email nhận đơn"
            className="min-w-0 flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Đang tra cứu...' : 'Tra cứu'}
          </button>
        </form>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {searchedEmail && !isLoading && !error && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 shadow-sm">
          Đang hiển thị đơn hàng cho email: {searchedEmail}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500 shadow-sm">
          Đang tải dữ liệu...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500 shadow-sm">
          Chưa tìm thấy đơn hàng nào. Hãy kiểm tra lại email hoặc liên hệ hỗ trợ.
          <div className="mt-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Tổng cộng {totalOrders} đơn</p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              const status = String(order.status ?? '').toLowerCase()

              return (
                <article key={order.orderId} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-black text-zinc-900">Đơn hàng #{order.orderId}</h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClassMap[status] ?? 'bg-zinc-100 text-zinc-700'}`}>
                          {statusLabelMap[status] ?? (status || 'Không xác định')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-500">
                        {new Date(order.createdAt).toLocaleString('vi-VN')} • Thanh toán: {order.paymentMethod}
                      </p>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-sm text-zinc-500">Tổng tiền</p>
                      <p className="text-2xl font-black text-red-700">{formatVnd(order.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
                    {order.items?.map((item) => (
                      <div key={`${order.orderId}-${item.productId}`} className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                          <img
                            src={item.productImage ? toAbsoluteImageUrl(item.productImage) : PLACEHOLDER_IMAGE}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-zinc-900">{item.productName}</p>
                          <p className="text-sm text-zinc-500">SL: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">{formatVnd(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

export default OrderLookupPage

