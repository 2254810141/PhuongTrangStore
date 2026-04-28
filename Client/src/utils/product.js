const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

export const PLACEHOLDER_IMAGE = '/product-placeholder.svg'

export function toAbsoluteImageUrl(path) {
  if (!path) return PLACEHOLDER_IMAGE
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${normalized}`
}

export function formatVnd(price) {
  return `${Number(price ?? 0).toLocaleString('vi-VN')}d`
}

export function mapProductDto(item) {
  const id = item.id ?? item.Id ?? item.productId ?? item.ProductId
  const name = item.name ?? item.Name ?? item.productName ?? item.ProductName ?? 'Sản phẩm'
  const image = item.image ?? item.Image ?? item.productsImages ?? item.ProductsImages
  const categoryId = item.categoryId ?? item.CategoryId ?? 0
  const price = Number(item.price ?? item.Price ?? 0)
  const isContactPrice = Boolean(item.isContactPrice ?? item.IsContactPrice)
  const isActive = item.isActive ?? item.IsActive ?? true

  return {
    id: String(id ?? ''),
    name,
    price,
    image: toAbsoluteImageUrl(image),
    isContactPrice,
    isActive,
    categoryId: Number(categoryId ?? 0),
    displayPrice: isContactPrice ? 'Liên hệ' : formatVnd(price),
  }
}

