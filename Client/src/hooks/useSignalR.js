import { useEffect, useRef, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'
import useAuthSession from './useAuthSession'

export function useSignalR(hubUrl) {
  const connectionRef = useRef(null)
  const { session } = useAuthSession()
  const token = session?.accessToken
  const reconnectTimeoutRef = useRef(null)

  const connect = useCallback(async () => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return
    }

    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          withCredentials: true,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .withHubProtocol(new signalR.JsonHubProtocol())
        .build()

      connectionRef.current = connection

      await connection.start()
      console.log('SignalR connected')
    } catch (error) {
      console.error('SignalR connection error:', error)
      // Retry after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, 5000)
    }
  }, [token, hubUrl])

  const disconnect = useCallback(async () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (connectionRef.current) {
      try {
        await connectionRef.current.stop()
      } catch (error) {
        console.error('Error stopping connection:', error)
      }
    }
  }, [])

  const on = useCallback((eventName, callback) => {
    if (connectionRef.current) {
      connectionRef.current.on(eventName, callback)
    }
  }, [])

  const off = useCallback((eventName, callback) => {
    if (connectionRef.current) {
      connectionRef.current.off(eventName, callback)
    }
  }, [])

  useEffect(() => {
    if (token) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [token, connect, disconnect])

  return {
    connection: connectionRef.current,
    isConnected: connectionRef.current?.state === signalR.HubConnectionState.Connected,
    on,
    off,
  }
}

