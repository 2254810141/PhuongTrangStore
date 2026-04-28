import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminBrands,
  getAdminCategories,
  getAdminProducts,
  updateAdminProduct,
} from '../../services/adminApi'
import { formatVnd, toAbsoluteImageUrl } from '../../utils/product'

function AdminProductPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      price: '',
      categoryId: '',
      brandId: '',
      isContactPrice: false,
      isActive: true,
      imageUrl: '',
      description: '',
      imageFile: null,
    },
  })

  const isContactPrice = watch('isContactPrice')
  const imageUrl = watch('imageUrl')

  useEffect(() => {
    if (isContactPrice) {
      setValue('price', '')
    }
  }, [isContactPrice, setValue])

  const categoryMap = useMemo(
    () => new Map(categories.map((item) => [String(item.id), item.name])),
    [categories],
  )

  const brandMap = useMemo(
    () => new Map(brands.map((item) => [String(item.id), item.name])),
    [brands],
  )

  const loadData = async () => {
    setIsLoading(true)
    setError('')

    try {
      const [productData, categoryData, brandData] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
        getAdminBrands(),
      ])

      setProducts(productData)
      setCategories(categoryData)
      setBrands(brandData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu sản phẩm')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const openCreateModal = () => {
    setSelectedProduct(null)
    reset({
      name: '',
      price: '',
      categoryId: '',
      brandId: '',
      isContactPrice: false,
      isActive: true,
      imageUrl: '',
      description: '',
      imageFile: null,
    })
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setSelectedProduct(product)
    reset({
      name: product.name ?? '',
      price: product.price ?? '',
      categoryId: product.categoryId ? String(product.categoryId) : '',
      brandId: product.brandId ? String(product.brandId) : '',
      isContactPrice: Boolean(product.isContactPrice),
      isActive: Boolean(product.isActive),
      imageUrl: product.image ?? '',
      description: product.description ?? '',
      imageFile: null,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xóa sản phẩm?',
      text: `Bạn chắc chắn muốn xóa sản phẩm "${product.name}" không?`,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteAdminProduct(product.id)
      await Swal.fire({ icon: 'success', title: 'Đã xóa', text: 'Sản phẩm đã được xóa.' })
      await loadData()
    } catch (err) {
      await Swal.fire({ icon: 'error', title: 'Xóa thất bại', text: err instanceof Error ? err.message : 'Không thể xóa sản phẩm' })
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      const payload = {
        name: values.name.trim(),
        categoryId: values.categoryId ? Number(values.categoryId) : null,
        brandId: values.brandId ? Number(values.brandId) : null,
        isContactPrice: Boolean(values.isContactPrice),
        isActive: Boolean(values.isActive),
        price: values.isContactPrice ? null : values.price === '' ? null : Number(values.price),
        imageUrl: values.imageUrl?.trim() || '',
        imageFile: values.imageFile?.[0] ?? null,
        description: values.description?.trim() || '',
      }

      if (selectedProduct) {
        await updateAdminProduct(selectedProduct.id, payload)
      } else {
        await createAdminProduct(payload)
      }

      await Swal.fire({
        icon: 'success',
        title: selectedProduct ? 'Cập nhật thành công' : 'Thêm mới thành công',
        text: 'Sản phẩm đã được lưu.',
      })

      closeModal()
      await loadData()
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: selectedProduct ? 'Cập nhật thất bại' : 'Thêm mới thất bại',
        text: err instanceof Error ? err.message : 'Không thể lưu sản phẩm',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const priceValue = watch('price')
  const priceDisabled = Boolean(isContactPrice)

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Quản lý Sản phẩm</p>
            <h2 className="mt-2 text-2xl font-black text-zinc-900">Danh sách sản phẩm</h2>
            <p className="mt-2 text-sm text-zinc-500">Quản lý ảnh, giá, danh mục, thương hiệu và trạng thái hoạt động.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500 shadow-sm">
          Đang tải sản phẩm...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Ảnh</th>
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Thương hiệu</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-4">
                        <img
                          src={toAbsoluteImageUrl(product.image)}
                          alt={product.name}
                          className="h-14 w-14 rounded-xl border border-zinc-200 object-cover"
                        />
                      </td>
                      <td className="px-4 py-4 font-semibold text-zinc-900">{product.name}</td>
                      <td className="px-4 py-4 text-zinc-700">
                        {product.isContactPrice ? 'Liên hệ' : formatVnd(product.price)}
                      </td>
                      <td className="px-4 py-4 text-zinc-700">{categoryMap.get(String(product.categoryId)) ?? '—'}</td>
                      <td className="px-4 py-4 text-zinc-700">{brandMap.get(String(product.brandId)) ?? '—'}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-600'
                          }`}
                        >
                          {product.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-red-500 hover:text-red-600"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center text-zinc-500" colSpan={7}>
                      Chưa có sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6">
          <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                  {selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                </p>
                <h3 className="mt-1 text-2xl font-black text-zinc-900">
                  {selectedProduct ? 'Cập nhật sản phẩm' : 'Tạo mới sản phẩm'}
                </h3>
              </div>
              <button type="button" onClick={closeModal} className="text-2xl leading-none text-zinc-400 hover:text-zinc-700">
                ×
              </button>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="product-name">
                  Tên sản phẩm
                </label>
                <input
                  id="product-name"
                  type="text"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                  {...register('name', { required: 'Vui lòng nhập tên sản phẩm' })}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="product-category">
                  Danh mục
                </label>
                <select
                  id="product-category"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                  {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="product-brand">
                  Thương hiệu
                </label>
                <select
                  id="product-brand"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                  {...register('brandId', { required: 'Vui lòng chọn thương hiệu' })}
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brandId && <p className="mt-1 text-xs text-red-600">{errors.brandId.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="product-price">
                  Giá
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={priceDisabled}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 disabled:bg-zinc-100"
                  {...register('price', {
                    validate: (value) =>
                      isContactPrice || value !== '' || 'Vui lòng nhập giá sản phẩm khi không chọn liên hệ',
                  })}
                />
                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="product-image-url">
                  Ảnh (URL)
                </label>
                <input
                  id="product-image-url"
                  type="text"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                  placeholder="Dán đường dẫn ảnh hoặc để trống nếu upload file"
                  {...register('imageUrl')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="product-image-file">
                  Ảnh file
                </label>
                <input
                  id="product-image-file"
                  type="file"
                  accept="image/*"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700"
                  {...register('imageFile')}
                />
              </div>

              <div className="md:col-span-2 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700">
                  <input type="checkbox" className="h-4 w-4 accent-red-600" {...register('isContactPrice')} />
                  IsContactPrice
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700">
                  <input type="checkbox" className="h-4 w-4 accent-red-600" {...register('isActive')} />
                  IsActive
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="product-description">
                  Mô tả
                </label>
                <textarea
                  id="product-description"
                  rows={3}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                  placeholder="Mô tả ngắn cho sản phẩm"
                  {...register('description')}
                />
              </div>

              <div className="md:col-span-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                <p className="font-semibold text-zinc-700">Xem trước ảnh</p>
                <div className="mt-3 flex items-center gap-4">
                  <img
                    src={toAbsoluteImageUrl(imageUrl)}
                    alt="Preview"
                    className="h-20 w-20 rounded-xl border border-zinc-200 object-cover"
                  />
                  <p className="text-xs text-zinc-500">
                    Ưu tiên upload file ảnh. Nếu không chọn file, hệ thống sẽ lưu URL ảnh hiện tại.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminProductPage

