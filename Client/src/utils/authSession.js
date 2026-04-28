const AUTH_STORAGE_KEY = 'phuongtrang_auth'
export const AUTH_SESSION_CHANGE_EVENT = 'phuongtrang_auth_change'

function emitAuthSessionChange() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT))
}

export function saveAuthSession(data) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
  emitAuthSessionChange()
}

export function getAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  emitAuthSessionChange()
}

