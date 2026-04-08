const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

function toAbsoluteImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${normalized}`
}

function mapAccessoryDto(item) {
  const price = Number(item.price ?? 0)
  const stockQuantity = item.stockQuantity ?? 0
  const isActive = item.isActive ?? true

  return {
    id: String(item.accessoryId),
    name: item.accessoryName ?? 'Phụ kiện',
    price,
    displayPrice: `${price.toLocaleString('vi-VN')} VND`,
    desc: item.description ?? 'Phụ kiện chính hãng cho góc làm việc của bạn.',
    details: [
      `Giá: ${price.toLocaleString('vi-VN')} VND`,
      `Tồn kho: ${stockQuantity}`,
      isActive ? 'Đang kinh doanh' : 'Ngừng kinh doanh',
    ],
    image: toAbsoluteImageUrl(item.imageUrl),
    stockQuantity,
    isActive,
  }
}

export async function getAccessories(keyword = '') {
  const trimmedKeyword = keyword.trim()
  const url = trimmedKeyword
    ? `${API_BASE_URL}/api/Accessory/search?keyword=${encodeURIComponent(trimmedKeyword)}`
    : `${API_BASE_URL}/api/Accessory`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Không thể tải danh sách phụ kiện (${response.status})`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data.map(mapAccessoryDto) : []
}

export async function getAccessoryById(accessoryId) {
  const accessories = await getAccessories()
  return accessories.find((item) => item.id === String(accessoryId)) ?? null
}

