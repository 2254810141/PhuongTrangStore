import { mapProductDto } from '../utils/product'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

export async function getProducts(keyword = '') {
  const trimmedKeyword = keyword.trim()
  const url = trimmedKeyword
    ? `${API_BASE_URL}/api/Product/search?keyword=${encodeURIComponent(trimmedKeyword)}`
    : `${API_BASE_URL}/api/Product`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Không thể tải danh sách sản phẩm (${response.status})`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data.map(mapProductDto) : []
}

export async function getProductById(productId) {
  const response = await fetch(`${API_BASE_URL}/api/Product/${productId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Không thể tải sản phẩm (${response.status})`)
  }

  const data = await response.json()
  return data ? mapProductDto(data) : null
}
