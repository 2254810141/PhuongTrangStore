import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAuthSession from '../../hooks/useAuthSession'
import { cancelMyOrder, getMyOrders } from '../../services/orderApi'
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

const cancelableStatuses = new Set(['draft', 'pending_confirm', 'pending_payment'])

function OrderHistoryPage() {
  const { session } = useAuthSession()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const isAuthenticated = Boolean(session?.accessToken)

  const refreshOrders = async () => {
    if (!isAuthenticated) {
      setOrders([])
      setError('')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await getMyOrders()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải lịch sử đặt hàng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refreshOrders()
  }, [isAuthenticated])

  const totalOrders = useMemo(() => orders.length, [orders])

  const handleCancel = async (orderId, orderCode) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Hủy đơn hàng?',
      text: `Bạn có chắc muốn hủy đơn #${orderCode} không?`,
      showCancelButton: true,
      confirmButtonText: 'Hủy đơn',
      cancelButtonText: 'Đóng',
      confirmButtonColor: '#dc2626',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await cancelMyOrder(orderId)
      await Swal.fire({
        icon: 'success',
        title: 'Đã hủy đơn hàng',
        text: `Đơn #${orderCode} đã được cập nhật sang trạng thái cancelled.`,
      })
      await refreshOrders()
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Hủy đơn thất bại',
        text: err instanceof Error ? err.message : 'Không thể hủy đơn hàng',
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="container-app space-y-4 rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black text-zinc-900">Lịch sử đặt hàng</h1>
        <p className="text-sm text-zinc-500">Bạn cần đăng nhập để xem các đơn hàng đã đặt.</p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Đăng nhập
          </Link>
          <Link
            to="/products"
            className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            Mua sắm tiếp
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="container-app space-y-6">

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Order history</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900">Lịch sử đặt hàng</h1>
        <p className="mt-2 text-sm text-zinc-500">Hiển thị các đơn hàng gần nhất của bạn. Tổng cộng {totalOrders} đơn.</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500 shadow-sm">
          Đang tải lịch sử đặt hàng...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500 shadow-sm">
          Chưa có đơn hàng nào. Hãy quay lại mua sắm nhé.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = String(order.status ?? '').toLowerCase()
            const canCancel = cancelableStatuses.has(status)

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
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order.orderId, order.orderId)}
                        className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
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
      )}
    </section>
  )
}

export default OrderHistoryPage



