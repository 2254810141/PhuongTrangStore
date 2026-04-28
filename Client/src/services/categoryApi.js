const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

function mapCategory(item) {
  const id = item.id ?? item.Id ?? item.categoryId ?? item.CategoryId
  const name = item.name ?? item.Name ?? item.categoryName ?? item.CategoryName ?? 'Danh mục'
  const isActive = item.isActive ?? item.IsActive ?? true

  return {
    id: String(id ?? ''),
    name,
    isActive,
  }
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/api/Category`)

  if (!response.ok) {
    throw new Error(`Không thể tải danh mục (${response.status})`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data.map(mapCategory) : []
}

