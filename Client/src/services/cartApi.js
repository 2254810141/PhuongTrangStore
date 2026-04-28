import { getAuthSession } from '../utils/authSession'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

function buildHeaders(hasBody = false) {
  const headers = {
    Accept: 'application/json',
  }

  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }

  const session = getAuthSession()
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`
  }

  return headers
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(Boolean(options.body)),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'string' && payload.trim()
      ? payload
      : payload?.message || payload?.title || `Cart request failed (${response.status})`
    throw new Error(message)
  }

  return payload
}

export async function getCart() {
  const data = await requestJson('/api/Cart')
  return Array.isArray(data) ? data : []
}

export async function addCartItem(payload) {
  return requestJson('/api/Cart/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateCartItem(payload) {
  return requestJson('/api/Cart/update', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function removeCartItem(productId) {
  return requestJson(`/api/Cart/remove/${productId}`, {
    method: 'DELETE',
  })
}

export async function clearCart() {
  return requestJson('/api/Cart/clear', {
    method: 'DELETE',
  })
}
