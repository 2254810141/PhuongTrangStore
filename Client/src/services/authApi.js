const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

async function parseApiError(response) {
  let message = `Yeu cau that bai (${response.status})`

  try {
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const data = await response.json()

      if (typeof data === 'string') {
        message = data
      } else if (data?.message) {
        message = data.message
      } else if (data?.title) {
        message = data.title
      } else if (data?.errors && typeof data.errors === 'object') {
        const entries = Object.values(data.errors).flat()
        if (entries.length > 0) {
          message = entries.join(' ')
        }
      }
    } else {
      const text = await response.text()
      if (text) {
        message = text
      }
    }
  } catch {
    // Keep fallback message when parsing fails.
  }

  return new Error(message)
}

export async function loginUser(payload, isAdmin = false) {
  const endpoint = isAdmin ? 'admin/login' : 'login'

  const response = await fetch(`${API_BASE_URL}/api/User/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  return response.json()
}

export async function registerUser(payload) {
  const response = await fetch(`${API_BASE_URL}/api/User/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  return response.json()
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) {
    return null
  }

  const response = await fetch(`${API_BASE_URL}/api/User/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  return null
}

