const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

function toAbsoluteImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${normalized}`
}

function mapProductDto(item) {
  const price = Number(item.price ?? 0)
  const stockQuantity = item.stockQuantity ?? 0

  return {
    id: String(item.productId),
    name: item.productName ?? 'Sản phẩm',
    price,
    displayPrice: `${price.toLocaleString('vi-VN')} VND`,
    stockQuantity,
    image: toAbsoluteImageUrl(item.productsImages),
    isActive: item.isActive ?? true,
    description:
      stockQuantity > 0
        ? `Còn ${stockQuantity} sản phẩm trong kho.`
        : 'Tạm hết hàn , vui lòng liên hệ để được tư vấn.',
    specs: [
      `Giá: ${price.toLocaleString('vi-VN')} VND`,
      `Tồn kho: ${stockQuantity}`,
      item.isActive ? 'Đang kinh doanh' : 'Ngừng kinh doanh',
    ],
    badge: stockQuantity > 0 ? 'Hàng sẵn kho' : 'Hết hàng',
  }
}

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
  const products = await getProducts()
  return products.find((item) => item.id === String(productId)) ?? null
}



