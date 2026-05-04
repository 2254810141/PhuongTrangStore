import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  cancelAdminOrder,
} from '../../services/adminApi'
import { formatVnd } from '../../utils/product'
import { useOrderNotifications } from '../../hooks/useOrderNotifications'

const ORDER_STATUS = {
  pending_confirm: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  pending_payment: { label: 'Chờ thanh toán', color: 'bg-orange-100 text-orange-800' },
  confirmed: { label: 'Đã thanh toán', color: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  expired: { label: 'Hết hạn', color: 'bg-gray-100 text-gray-800' },
}

const getStatusDisplay = (status) => {
  const normalized = status?.toLowerCase()
  return ORDER_STATUS[normalized] || { label: status || 'Không xác định', color: 'bg-zinc-100 text-zinc-800' }
}

function AdminOrderPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    status: '',
  })

  // Thông báo thời gian thực từ SignalR
  const { notificationCount, isConnected } = useOrderNotifications(() => {
    // Auto refresh orders khi có đơn hàng mới
    loadOrders()
  })

  const loadOrders = async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await getAdminOrders()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách đơn hàng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch =
        !filters.search ||
        order.orderCode?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerPhone?.includes(filters.search)

      const statusMatch = !filters.status || order.status?.toLowerCase() === filters.status.toLowerCase()

      return searchMatch && statusMatch
    })
  }, [orders, filters])

  const handleViewDetail = async (order) => {
    try {
      const detail = await getAdminOrderById(order.id)
      setSelectedOrder(detail)
      setDetailModalOpen(true)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err instanceof Error ? err.message : 'Không thể tải chi tiết đơn hàng',
      })
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Xác nhận cập nhật',
      text: `Bạn có chắc muốn đổi trạng thái đơn hàng thành "${ORDER_STATUS[newStatus]?.label || newStatus}"?`,
      showCancelButton: true,
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d97706',
    })

    if (!result.isConfirmed) return

    setIsUpdating(true)
    try {
      await updateAdminOrderStatus(orderId, newStatus)
      await loadOrders()
      if (selectedOrder?.id === orderId) {
        const updated = await getAdminOrderById(orderId)
        setSelectedOrder(updated)
      }
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã cập nhật trạng thái đơn hàng',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err instanceof Error ? err.message : 'Không thể cập nhật trạng thái',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận hủy đơn',
      text: 'Bạn có chắc muốn hủy đơn hàng này? Hành động này không thể hoàn tác.',
      showCancelButton: true,
      confirmButtonText: 'Hủy đơn',
      cancelButtonText: 'Đóng',
      confirmButtonColor: '#dc2626',
    })

    if (!result.isConfirmed) return

    setIsUpdating(true)
    try {
      await cancelAdminOrder(orderId)
      await loadOrders()
      if (selectedOrder?.id === orderId) {
        const updated = await getAdminOrderById(orderId)
        setSelectedOrder(updated)
      }
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã hủy đơn hàng',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err instanceof Error ? err.message : 'Không thể hủy đơn hàng',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getNextStatusOptions = (currentStatus) => {
    const flow = {
      pending_confirm: ['shipping'],
      confirmed: ['shipping'],
      shipping: ['delivered'],
      delivered: [],
      cancelled: [],
      expired: [],
      pending_payment: [],
    }
    return flow[currentStatus?.toLowerCase()] || []
  }

  const canCancel = (status) => {
    return status?.toLowerCase() === 'pending_confirm'
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Quản lý đơn hàng</p>
            <h1 className="mt-1 text-2xl font-black text-zinc-900">Danh sách đơn hàng</h1>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && notificationCount > 0 && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-green-700 font-semibold">{notificationCount} đơn mới</p>
              </div>
            )}
            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
            >
              {isLoading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên, email, số điện thoại..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="flex-1 min-w-[250px] rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(ORDER_STATUS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Đã xảy ra lỗi:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Đang tải đơn hàng...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            {orders.length === 0 ? 'Chưa có đơn hàng nào.' : 'Không tìm thấy đơn hàng phù hợp.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Mã đơn hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Khách hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Phương thức
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Ngày đặt
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900">{order.orderCode || order.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-zinc-900">{order.customerName}</div>
                      <div className="text-xs text-zinc-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-zinc-900">{formatVnd(order.totalAmount)}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700">{order.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          getStatusDisplay(order.status).color
                        }`}
                      >
                        {getStatusDisplay(order.status).label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-zinc-900">Chi tiết đơn hàng</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 rounded-xl bg-zinc-50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Mã đơn hàng</p>
                  <p className="font-semibold text-zinc-900">{selectedOrder.orderCode || selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Ngày đặt</p>
                  <p className="font-semibold text-zinc-900">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Khách hàng</p>
                  <p className="font-semibold text-zinc-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-zinc-600">{selectedOrder.customerEmail}</p>
                  <p className="text-sm text-zinc-600">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Phương thức thanh toán</p>
                  <p className="font-semibold text-zinc-900">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Địa chỉ giao hàng</p>
                <p className="mt-1 text-sm text-zinc-900">{selectedOrder.shippingAddress}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-600">Trạng thái:</span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    getStatusDisplay(selectedOrder.status).color
                  }`}
                >
                  {getStatusDisplay(selectedOrder.status).label}
                </span>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">Sản phẩm</p>
                  <div className="rounded-xl border border-zinc-200">
                    <table className="w-full">
                      <thead className="bg-zinc-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-600">Sản phẩm</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-zinc-600">SL</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-600">Đơn giá</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-600">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 text-sm text-zinc-900">{item.productName || item.name}</td>
                            <td className="px-3 py-2 text-center text-sm text-zinc-900">{item.quantity}</td>
                            <td className="px-3 py-2 text-right text-sm text-zinc-900">{formatVnd(item.unitPrice || item.price)}</td>
                            <td className="px-3 py-2 text-right text-sm font-semibold text-zinc-900">
                              {formatVnd((item.unitPrice || item.price) * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-zinc-50">
                        <tr>
                          <td colSpan="3" className="px-3 py-2 text-right text-sm font-semibold text-zinc-900">
                            Tổng cộng:
                          </td>
                          <td className="px-3 py-2 text-right text-sm font-bold text-amber-700">
                            {formatVnd(selectedOrder.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {selectedOrder.status?.toLowerCase() !== 'expired' &&
                selectedOrder.status?.toLowerCase() !== 'delivered' &&
                selectedOrder.status?.toLowerCase() !== 'cancelled' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-3 text-sm font-semibold text-amber-900">Thao tác</p>
                  <div className="flex flex-wrap gap-2">
                    {getNextStatusOptions(selectedOrder.status).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        disabled={isUpdating}
                        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
                      >
                        {status === 'shipping' ? 'Đang giao' : getStatusDisplay(status).label}
                      </button>
                    ))}
                    {canCancel(selectedOrder.status) && (
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        disabled={isUpdating}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrderPage
