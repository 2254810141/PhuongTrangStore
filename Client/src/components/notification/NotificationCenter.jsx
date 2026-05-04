import { useEffect, useState } from 'react'
import { useOrderNotifications } from '../../hooks/useOrderNotifications'
import { formatVnd } from '../../utils/product'

function NotificationCenter() {
  const [toasts, setToasts] = useState([])
  const { notificationCount, latestNotification, isConnected, resetLatestNotification } = useOrderNotifications((notification) => {
    // Add new toast
    const id = Date.now()
    setToasts((prev) => [
      ...prev,
      {
        id,
        notification,
        isShowing: true,
      },
    ])

    // Auto remove toast after 8 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 8000)

    resetLatestNotification()
  })

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <>
      {/* Connection Status Indicator */}
      {/* Uncomment this if you want to show connection status */}
      {/* <div className="fixed top-4 right-4 z-40">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${
            isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {isConnected ? 'Đang kết nối' : 'Đã ngắt kết nối'}
        </div>
      </div> */}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-in fade-in slide-in-from-bottom-5 duration-300 bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-green-700 text-sm">🎉 Đơn hàng mới</h3>
                <div className="mt-2 space-y-1 text-sm text-zinc-700">
                  <p>
                    <span className="font-semibold">Khách:</span> {toast.notification.customerName}
                  </p>
                  <p>
                    <span className="font-semibold">Số điện thoại:</span> {toast.notification.customerPhone}
                  </p>
                  <p>
                    <span className="font-semibold">Tổng tiền:</span>{' '}
                    <span className="text-amber-600 font-bold">{formatVnd(toast.notification.totalAmount)}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Sản phẩm:</span> {toast.notification.itemCount} mục
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {new Date(toast.notification.createdAt).toLocaleTimeString('vi-VN')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-600 transition"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default NotificationCenter

