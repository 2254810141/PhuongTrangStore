import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import useAuthSession from '../../hooks/useAuthSession'
import { checkoutCod, checkoutCodGuest, checkoutVnPay } from '../../services/orderApi'

const currency = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

function CheckoutPage({ cartItems = [], onRefreshCart = async () => {}, onClearCart = async () => {} }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useAuthSession()
  const isAuthenticated = Boolean(session?.accessToken)
  const selectedProductIds = Array.isArray(location.state?.selectedProductIds) ? location.state.selectedProductIds : []

  const checkoutItems = useMemo(() => {
    if (selectedProductIds.length === 0) {
      return cartItems
    }

    const selectedIds = new Set(selectedProductIds.map((id) => Number(id)))
    return cartItems.filter((item) => selectedIds.has(Number(item.id)))
  }, [cartItems, selectedProductIds])

  const hasContactItems = checkoutItems.some((item) => item.isContactPrice)

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      shippingAddress: '',
      paymentMethod: 'cod',
    },
  })

  useEffect(() => {
    reset({
      customerName: session?.user?.fullName ?? '',
      customerPhone: session?.user?.phone ?? '',
      customerEmail: session?.user?.email ?? '',
      shippingAddress: '',
      paymentMethod: 'cod',
    })
  }, [reset, session])

  const subtotal = useMemo(
    () => checkoutItems.reduce((total, item) => total + Number(item.price ?? 0) * Number(item.quantity ?? 0), 0),
    [checkoutItems],
  )

  const onSubmit = async (values) => {
    if (checkoutItems.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Giỏ hàng trống',
        text: 'Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán.',
      })
      return
    }

    if (hasContactItems) {
      await Swal.fire({
        icon: 'info',
        title: 'Sản phẩm cần liên hệ',
        text: 'Trong giỏ có sản phẩm báo giá liên hệ. Vui lòng liên hệ để được tư vấn trước khi thanh toán.',
      })
      return
    }

    const payload = {
      customerName: values.customerName.trim(),
      customerPhone: values.customerPhone.trim(),
      customerEmail: values.customerEmail.trim() || null,
      shippingAddress: values.shippingAddress.trim(),
    }

    try {
      if (!isAuthenticated) {
        const result = await checkoutCodGuest({
          ...payload,
          items: checkoutItems.map((item) => ({
            productId: Number(item.productId ?? item.id),
            quantity: Number(item.quantity ?? 1),
          })),
        })

        await onClearCart()
        await Swal.fire({
          icon: 'success',
          title: 'Đặt hàng thành công',
          text: `Mã đơn hàng #${result.orderId} đã được tạo.`,
        })
        navigate(isAuthenticated ? '/orders' : '/', { replace: true })
        return
      }

      if (values.paymentMethod === 'vnpay') {
        const result = await checkoutVnPay({
          ...payload,
          selectedProductIds: checkoutItems.map((item) => Number(item.id)),
        })
        await Swal.fire({
          icon: 'success',
          title: 'Chuyển sang thanh toán VNPAY',
          text: `Đơn hàng #${result.orderId} đã được tạo. Bạn sẽ được chuyển đến cổng thanh toán.`,
          confirmButtonText: 'Thanh toán ngay',
        })
        window.location.href = result.paymentUrl
        return
      }

      const result = await checkoutCod({
        ...payload,
        selectedProductIds: checkoutItems.map((item) => Number(item.id)),
      })
      await onRefreshCart()
      await Swal.fire({
        icon: 'success',
        title: 'Đặt hàng thành công',
        text: `Mã đơn hàng #${result.orderId} đã được tạo.`,
      })
      navigate(isAuthenticated ? '/orders' : '/', { replace: true })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Thanh toán thất bại',
        text: error instanceof Error ? error.message : 'Không thể xử lý thanh toán',
      })
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <section className="container-app space-y-4 rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black text-zinc-900">Checkout</h1>
        <p className="text-sm text-zinc-500">Giỏ hàng của bạn đang trống.</p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Quay lại mua sắm
        </Link>
      </section>
    )
  }

  return (
    <section className="container-app space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Checkout</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900">Thanh toán đơn hàng</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {isAuthenticated
            ? 'Bạn có thể chọn thanh toán COD hoặc VNPAY.'
            : 'Khách vãng lai chỉ thanh toán khi nhận hàng (COD).'}
        </p>
      </div>

      {hasContactItems && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Có sản phẩm cần liên hệ trước khi đặt hàng. Vui lòng vào trang <Link to="/contact" className="font-semibold underline">Contact</Link>.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-zinc-900">Thông tin giao hàng</h2>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">Họ và tên</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                  {...register('customerName', { required: 'Vui lòng nhập họ và tên' })}
                />
                {errors.customerName && <p className="mt-1 text-xs text-red-600">{errors.customerName.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">Số điện thoại</label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                  {...register('customerPhone', { required: 'Vui lòng nhập số điện thoại' })}
                />
                {errors.customerPhone && <p className="mt-1 text-xs text-red-600">{errors.customerPhone.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                {...register('customerEmail')}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Địa chỉ giao hàng</label>
              <textarea
                rows="4"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
                {...register('shippingAddress', { required: 'Vui lòng nhập địa chỉ giao hàng' })}
              />
              {errors.shippingAddress && <p className="mt-1 text-xs text-red-600">{errors.shippingAddress.message}</p>}
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm font-semibold text-zinc-700">Phương thức thanh toán</p>
              <div className="mt-3 space-y-3">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm">
                  <span>Thanh toán khi nhận hàng (COD)</span>
                  <input type="radio" value="cod" {...register('paymentMethod')} />
                </label>

                {isAuthenticated ? (
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm">
                    <span>Thanh toán VNPAY</span>
                    <input type="radio" value="vnpay" {...register('paymentMethod')} />
                  </label>
                ) : (
                  <p className="text-xs text-zinc-500">Đăng nhập để dùng VNPAY.</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || hasContactItems}
              className="w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-800 disabled:opacity-60"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </button>
          </form>
        </div>

        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-zinc-900">Đơn hàng của bạn</h2>
          <div className="mt-5 space-y-4">
            {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-zinc-900">{item.name}</p>
                  <p className="text-sm text-zinc-500">SL: {item.quantity}</p>
                </div>
                <div className="text-sm font-semibold text-zinc-900">
                  {currency.format(Number(item.price ?? 0) * Number(item.quantity ?? 0))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Tạm tính</span>
              <span>{currency.format(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-lg font-black text-zinc-900">
              <span>Tổng tiền</span>
              <span>{currency.format(subtotal)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-600">
            {watch('paymentMethod') === 'vnpay' && isAuthenticated
              ? 'Sau khi xác nhận, bạn sẽ được chuyển sang cổng thanh toán VNPAY.'
              : 'Đơn hàng COD sẽ được tạo ngay sau khi bạn xác nhận.'}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default CheckoutPage

