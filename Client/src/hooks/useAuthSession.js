import { useEffect, useState } from 'react'
import { AUTH_SESSION_CHANGE_EVENT, getAuthSession } from '../utils/authSession'

export default function useAuthSession() {
  const [session, setSession] = useState(() => getAuthSession())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const syncSession = () => {
      setSession(getAuthSession())
    }

    const handleStorage = (event) => {
      if (!event || event.key === null || event.key === 'phuongtrang_auth') {
        syncSession()
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(AUTH_SESSION_CHANGE_EVENT, syncSession)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, syncSession)
    }
  }, [])

  const role = String(session?.user?.role ?? '').toLowerCase()

  return {
    session,
    isAdmin: role === 'admin',
  }
}

