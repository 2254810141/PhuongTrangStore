import axios from 'axios'
import { getAuthSession } from '../utils/authSession'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5026'

const adminApi = axios.create({
  baseURL: API_BASE_URL,
})

adminApi.interceptors.request.use((config) => {
  const session = getAuthSession()

  if (session?.accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

function getErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    const response = error.response
    const data = response?.data

    if (typeof data === 'string' && data.trim()) {
      return data
    }

    if (data?.message) {
      return data.message
    }

    if (data?.title) {
      return data.title
    }

    if (data?.errors && typeof data.errors === 'object') {
      const message = Object.values(data.errors).flat().filter(Boolean).join(' ')
      if (message) {
        return message
      }
    }

    if (response?.status) {
      return `${fallbackMessage} (${response.status})`
    }

    return error.message || fallbackMessage
  }

  return error instanceof Error ? error.message : fallbackMessage
}

async function request(config, fallbackMessage) {
  try {
    const response = await adminApi.request(config)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, fallbackMessage))
  }
}

function appendProductFormData(formData, payload) {
  formData.append('Name', payload.name ?? '')

  if (payload.categoryId !== undefined && payload.categoryId !== null && payload.categoryId !== '') {
    formData.append('CategoryId', String(payload.categoryId))
  }

  if (payload.brandId !== undefined && payload.brandId !== null && payload.brandId !== '') {
    formData.append('BrandId', String(payload.brandId))
  }

  formData.append('IsContactPrice', String(Boolean(payload.isContactPrice)))
  formData.append('IsActive', String(Boolean(payload.isActive)))

  if (!payload.isContactPrice && payload.price !== undefined && payload.price !== null && payload.price !== '') {
    formData.append('Price', String(payload.price))
  }

  if (payload.imageFile instanceof File) {
    formData.append('ImageFile', payload.imageFile)
  } else if (payload.imageUrl && payload.imageUrl.trim()) {
    formData.append('Image', payload.imageUrl.trim())
  }

  if (payload.description && payload.description.trim()) {
    formData.append('Description', payload.description.trim())
  }
}

function mapProduct(item) {
  return {
    id: String(item.id ?? item.Id ?? item.productId ?? item.ProductId ?? ''),
    categoryId: item.categoryId ?? item.CategoryId ?? null,
    brandId: item.brandId ?? item.BrandId ?? null,
    name: item.name ?? item.Name ?? 'Sản phẩm',
    price: item.price ?? item.Price ?? null,
    isContactPrice: item.isContactPrice ?? item.IsContactPrice ?? false,
    isActive: item.isActive ?? item.IsActive ?? true,
    image: item.image ?? item.Image ?? '',
    description: item.description ?? item.Description ?? '',
  }
}

function mapEntity(item) {
  return {
    id: String(item.id ?? item.Id ?? ''),
    name: item.name ?? item.Name ?? 'Mục',
    isActive: item.isActive ?? item.IsActive ?? true,
  }
}

export async function loginAdmin(payload) {
  return request(
    {
      method: 'post',
      url: '/api/User/admin/login',
      data: payload,
    },
    'Đăng nhập admin thất bại',
  )
}

export async function registerAdmin(payload) {
  return request(
    {
      method: 'post',
      url: '/api/User/admin/register',
      data: payload,
    },
    'Đăng ký admin thất bại',
  )
}

export async function getAdminProducts() {
  const data = await request(
    {
      method: 'get',
      url: '/api/Product',
    },
    'Không thể tải danh sách sản phẩm',
  )

  return Array.isArray(data) ? data.map(mapProduct) : []
}

export async function createAdminProduct(payload) {
  const formData = new FormData()
  appendProductFormData(formData, payload)

  return request(
    {
      method: 'post',
      url: '/api/Product/create',
      data: formData,
    },
    'Không thể tạo sản phẩm',
  )
}

export async function updateAdminProduct(productId, payload) {
  const formData = new FormData()
  appendProductFormData(formData, payload)

  return request(
    {
      method: 'put',
      url: `/api/Product/${productId}`,
      data: formData,
    },
    'Không thể cập nhật sản phẩm',
  )
}

export async function deleteAdminProduct(productId) {
  return request(
    {
      method: 'delete',
      url: `/api/Product/${productId}`,
    },
    'Không thể xóa sản phẩm',
  )
}

export async function getAdminCategories() {
  const data = await request(
    {
      method: 'get',
      url: '/api/Category',
    },
    'Không thể tải danh sách danh mục',
  )

  return Array.isArray(data) ? data.map(mapEntity) : []
}

export async function createAdminCategory(payload) {
  return request(
    {
      method: 'post',
      url: '/api/Category/create',
      data: payload,
    },
    'Không thể tạo danh mục',
  )
}

export async function updateAdminCategory(id, payload) {
  return request(
    {
      method: 'put',
      url: `/api/Category/${id}`,
      data: payload,
    },
    'Không thể cập nhật danh mục',
  )
}

export async function deleteAdminCategory(id) {
  return request(
    {
      method: 'delete',
      url: `/api/Category/${id}`,
    },
    'Không thể xóa danh mục',
  )
}

export async function getAdminBrands() {
  const data = await request(
    {
      method: 'get',
      url: '/api/Brand',
    },
    'Không thể tải danh sách thương hiệu',
  )

  return Array.isArray(data) ? data.map(mapEntity) : []
}

export async function createAdminBrand(payload) {
  return request(
    {
      method: 'post',
      url: '/api/Brand/create',
      data: payload,
    },
    'Không thể tạo thương hiệu',
  )
}

export async function updateAdminBrand(id, payload) {
  return request(
    {
      method: 'put',
      url: `/api/Brand/${id}`,
      data: payload,
    },
    'Không thể cập nhật thương hiệu',
  )
}

export async function deleteAdminBrand(id) {
  return request(
    {
      method: 'delete',
      url: `/api/Brand/${id}`,
    },
    'Không thể xóa thương hiệu',
  )
}

function mapOrder(item) {
  return {
    id: String(item.id ?? item.Id ?? item.orderId ?? item.OrderId ?? ''),
    orderCode: item.orderCode ?? item.OrderCode ?? '',
    customerName: item.customerName ?? item.CustomerName ?? item.fullName ?? item.FullName ?? 'Khách hàng',
    customerEmail: item.customerEmail ?? item.CustomerEmail ?? item.email ?? item.Email ?? '',
    customerPhone: item.customerPhone ?? item.CustomerPhone ?? item.phone ?? item.Phone ?? '',
    totalAmount: item.totalAmount ?? item.TotalAmount ?? 0,
    status: item.status ?? item.Status ?? 'Pending',
    paymentMethod: item.paymentMethod ?? item.PaymentMethod ?? 'COD',
    paymentStatus: item.paymentStatus ?? item.PaymentStatus ?? 'Pending',
    shippingAddress: item.shippingAddress ?? item.ShippingAddress ?? '',
    createdAt: item.createdAt ?? item.CreatedAt ?? item.orderDate ?? item.OrderDate ?? '',
    items: item.items ?? item.Items ?? item.orderItems ?? item.OrderItems ?? [],
  }
}

export async function getAdminOrders() {
  const data = await request(
    {
      method: 'get',
      url: '/api/Order',
    },
    'Không thể tải danh sách đơn hàng',
  )

  return Array.isArray(data) ? data.map(mapOrder) : []
}

export async function getAdminOrderById(orderId) {
  const data = await request(
    {
      method: 'get',
      url: `/api/Order/${orderId}`,
    },
    'Không thể tải thông tin đơn hàng',
  )

  return data ? mapOrder(data) : null
}

export async function updateAdminOrderStatus(orderId, status) {
  return request(
    {
      method: 'patch',
      url: `/api/Order/${orderId}/status`,
      data: { status },
    },
    'Không thể cập nhật trạng thái đơn hàng',
  )
}

export async function cancelAdminOrder(orderId) {
  return request(
    {
      method: 'patch',
      url: `/api/Order/${orderId}/cancel`,
    },
    'Không thể hủy đơn hàng',
  )
}

export async function getUnreadNotifications() {
  return request(
    {
      method: 'get',
      url: '/api/notifications/unread',
    },
    'Không thể tải thông báo',
  )
}

export async function markNotificationAsRead(id) {
  return request(
    {
      method: 'post',
      url: id ? `/api/notifications/mark-as-read/${id}` : '/api/notifications/mark-as-read',
    },
    'Không thể cập nhật trạng thái thông báo',
  )
}

