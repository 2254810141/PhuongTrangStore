import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

function AdminSimpleCrudPage({
  title,
  description,
  entityLabel,
  emptyLabel,
  loadItems,
  createItem,
  updateItem,
  deleteItem,
}) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fieldId = String(entityLabel).replace(/\s+/g, '-').toLowerCase()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      isActive: true,
    },
  })

  const refreshItems = async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await loadItems()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Không thể tải ${entityLabel}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refreshItems()
  }, [])

  const openCreateModal = () => {
    setSelectedItem(null)
    reset({ name: '', isActive: true })
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setSelectedItem(item)
    reset({ name: item.name ?? '', isActive: Boolean(item.isActive) })
    setModalOpen(true)
  }

  const closeModal = () => {
    setSelectedItem(null)
    reset({ name: '', isActive: true })
    setModalOpen(false)
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: `Xóa ${entityLabel}?`,
      text: `Bạn có chắc muốn xóa ${entityLabel} "${item.name}" không?`,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteItem(item.id)
      await Swal.fire({ icon: 'success', title: 'Đã xóa', text: `${entityLabel} đã được xóa.` })
      await refreshItems()
    } catch (err) {
      await Swal.fire({ icon: 'error', title: 'Xóa thất bại', text: err instanceof Error ? err.message : `Không thể xóa ${entityLabel}` })
    }
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      const payload = {
        name: values.name.trim(),
        isActive: values.isActive,
      }

      if (selectedItem) {
        await updateItem(selectedItem.id, payload)
      } else {
        await createItem(payload)
      }

      await Swal.fire({
        icon: 'success',
        title: selectedItem ? 'Cập nhật thành công' : 'Thêm mới thành công',
        text: `${entityLabel} đã được lưu.`,
      })

      closeModal()
      await refreshItems()
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: selectedItem ? 'Cập nhật thất bại' : 'Thêm mới thất bại',
        text: err instanceof Error ? err.message : `Không thể lưu ${entityLabel}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">{title}</p>
            <h2 className="mt-2 text-2xl font-black text-zinc-900">{description}</h2>
            <p className="mt-2 text-sm text-zinc-500">{emptyLabel}</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            + Thêm {entityLabel}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500 shadow-sm">
          Đang tải {entityLabel}...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-4 font-semibold text-zinc-600">{index + 1}</td>
                    <td className="px-4 py-4 font-semibold text-zinc-900">{item.name}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {item.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-red-500 hover:text-red-600"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
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
                  <td className="px-4 py-10 text-center text-zinc-500" colSpan={4}>
                    Chưa có {entityLabel} nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                  {selectedItem ? `Sửa ${entityLabel}` : `Thêm ${entityLabel}`}
                </p>
                <h3 className="mt-1 text-2xl font-black text-zinc-900">
                  {selectedItem ? `Cập nhật ${entityLabel}` : `Tạo mới ${entityLabel}`}
                </h3>
              </div>
              <button type="button" onClick={closeModal} className="text-2xl leading-none text-zinc-400 hover:text-zinc-700">
                ×
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor={`name-${fieldId}`}>
                  Tên {entityLabel}
                </label>
                <input
                  id={`name-${fieldId}`}
                  type="text"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                  {...register('name', { required: `Vui lòng nhập tên ${entityLabel}` })}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700">
                <input type="checkbox" className="h-4 w-4 accent-red-600" {...register('isActive')} />
                Đang hoạt động
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
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

export default AdminSimpleCrudPage




