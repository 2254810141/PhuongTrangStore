const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

function mapBrand(item) {
  const id = item.id ?? item.Id ?? item.brandId ?? item.BrandId
  const name = item.name ?? item.Name ?? item.brandName ?? item.BrandName ?? 'Thương hiệu'
  const isActive = item.isActive ?? item.IsActive ?? true

  return {
    id: String(id ?? ''),
    name,
    isActive,
  }
}

export async function getBrands() {
  const response = await fetch(`${API_BASE_URL}/api/Brand`)

  if (!response.ok) {
    throw new Error(`Không thể tải danh sách thương hiệu (${response.status})`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data.map(mapBrand) : []
}

