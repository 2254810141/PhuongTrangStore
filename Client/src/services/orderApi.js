import { getAuthSession } from '../utils/authSession'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

function buildHeaders(hasBody = false, authenticated = false) {
  const headers = {
    Accept: 'application/json',
  }

  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }

  if (authenticated) {
    const session = getAuthSession()
    if (session?.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`
    }
  }

  return headers
}

async function requestJson(path, options = {}, authenticated = false) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(Boolean(options.body), authenticated),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'string' && payload.trim()
      ? payload
      : payload?.message || payload?.title || `Order request failed (${response.status})`
    throw new Error(message)
  }

  return payload
}

export async function checkoutCod(payload) {
  return requestJson('/api/Order/checkout/cod', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true)
}

export async function checkoutCodGuest(payload) {
  return requestJson('/api/Order/checkout/cod/guest', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function checkoutVnPay(payload) {
  return requestJson('/api/Order/checkout/vnpay', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true)
}

export async function getMyOrders() {
  const data = await requestJson('/api/Order/my', {
    method: 'GET',
  }, true)

  return Array.isArray(data) ? data : []
}

export async function cancelMyOrder(orderId) {
  return requestJson(`/api/Order/my/${orderId}/cancel`, {
    method: 'PATCH',
  }, true)
}

export async function lookupOrdersByEmail(payload) {
  const data = await requestJson('/api/Order/lookup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return Array.isArray(data) ? data : []
}

