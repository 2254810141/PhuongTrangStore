import { useEffect, useCallback, useState } from 'react'
import { useSignalR } from './useSignalR'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'
const HUB_URL = `${API_BASE_URL.replace(/\/$/, '')}/hubs/order-notification`

export function useOrderNotifications(onOrderCreated) {
  const [notificationCount, setNotificationCount] = useState(0)
  const [latestNotification, setLatestNotification] = useState(null)
  const { on, off, isConnected } = useSignalR(HUB_URL)

  const handleNewOrderCreated = useCallback(
    (notification) => {
      console.log('New order notification received:', notification)
      setLatestNotification(notification)
      setNotificationCount((prev) => prev + 1)

      if (onOrderCreated) {
        onOrderCreated(notification)
      }
    },
    [onOrderCreated]
  )

  useEffect(() => {
    if (isConnected) {
      on('NewOrderCreated', handleNewOrderCreated)

      return () => {
        off('NewOrderCreated', handleNewOrderCreated)
      }
    }
  }, [isConnected, on, off, handleNewOrderCreated])

  const resetNotificationCount = useCallback(() => {
    setNotificationCount(0)
  }, [])

  const resetLatestNotification = useCallback(() => {
    setLatestNotification(null)
  }, [])

  return {
    isConnected,
    notificationCount,
    latestNotification,
    resetNotificationCount,
    resetLatestNotification,
  }
}


