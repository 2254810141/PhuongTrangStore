import { useEffect, useMemo, useRef, useState } from 'react'
import { getUnreadNotifications, markNotificationAsRead } from '../../services/adminApi'
import { useOrderNotifications } from '../../hooks/useOrderNotifications'

const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('vi-VN', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
  })
}

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const dropdownRef = useRef(null)

  const syncUnreadList = async () => {
	try {
	  const result = await getUnreadNotifications()
	  setUnreadCount(Number(result?.count ?? 0))
	  setNotifications(Array.isArray(result?.items) ? result.items.slice(0, 5) : [])
	} catch {
	  setUnreadCount(0)
	  setNotifications([])
	}
  }

  useEffect(() => {
	void syncUnreadList()
  }, [])

  useEffect(() => {
	const handleClickOutside = (event) => {
	  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
		setIsOpen(false)
	  }
	}

	document.addEventListener('mousedown', handleClickOutside)
	return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNewOrderCreated = useMemo(
	() => (notification) => {
	  setUnreadCount((current) => current + 1)
	  setNotifications((current) => {
		const nextItem = {
		  id: notification.id ?? notification.orderId ?? Date.now(),
		  title: notification.title ?? `Đơn hàng mới #${notification.orderId}`,
		  message: notification.message ?? 'Có đơn hàng mới',
		  orderId: notification.orderId ?? null,
		  isRead: false,
		  createdAt: notification.createdAt ?? new Date().toISOString(),
		}

		const withoutDuplicate = current.filter((item) => item.id !== nextItem.id)
		return [nextItem, ...withoutDuplicate].slice(0, 5)
	  })
	},
	[]
  )

  useOrderNotifications(handleNewOrderCreated)

  const handleMarkAsRead = async (id) => {
	try {
	  await markNotificationAsRead(id)
	  if (id) {
		setNotifications((current) => current.filter((item) => item.id !== id))
		setUnreadCount((current) => Math.max(0, current - 1))
	  } else {
		setNotifications([])
		setUnreadCount(0)
	  }
	} catch {
	  // keep UI stable even if mark-read fails
	}
  }

  return (
	<div className="relative" ref={dropdownRef}>
	  <button
		type="button"
		onClick={() => setIsOpen((current) => !current)}
		className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-800 shadow-sm transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
		aria-label="Thông báo"
	  >
		<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
		  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
		  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a3 3 0 0 0 6 0" />
		</svg>

		{unreadCount > 0 && (
		  <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-amber-600 px-1.5 py-0.5 text-[11px] font-bold leading-4 text-amber-50 shadow">
			{unreadCount > 99 ? '99+' : unreadCount}
		  </span>
		)}
	  </button>

	  {isOpen && (
		<div className="absolute right-0 z-50 mt-3 w-[22rem] overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl">
		  <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50 px-4 py-3">
			<div>
			  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Thông báo</p>
			  <p className="text-sm text-amber-900">Đơn hàng mới chưa đọc</p>
			</div>
			<button
			  type="button"
			  onClick={() => handleMarkAsRead()}
			  className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-200"
			>
			  Đọc hết
			</button>
		  </div>

		  <div className="max-h-96 divide-y divide-amber-100 overflow-y-auto">
			{notifications.length > 0 ? (
			  notifications.map((item) => (
				<div key={item.id} className="px-4 py-3 transition hover:bg-amber-50">
				  <div className="flex items-start justify-between gap-3">
					<div className="min-w-0 flex-1">
					  <p className="truncate text-sm font-semibold text-amber-900">{item.title}</p>
					  <p className="mt-1 text-sm text-amber-700">{item.message}</p>
					  <p className="mt-2 text-xs text-amber-500">{formatDateTime(item.createdAt)}</p>
					</div>
					<button
					  type="button"
					  onClick={() => handleMarkAsRead(item.id)}
					  className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
					>
					  Đã đọc
					</button>
				  </div>
				</div>
			  ))
			) : (
			  <div className="px-4 py-8 text-center text-sm text-amber-700">Không có thông báo mới.</div>
			)}
		  </div>
		</div>
	  )}
	</div>
  )
}

export default NotificationBell
