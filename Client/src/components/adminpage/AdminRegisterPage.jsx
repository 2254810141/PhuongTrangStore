import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { registerAdmin } from '../../services/adminApi'

function AdminRegisterPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      adminRegistrationCode: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      if (values.password !== values.confirmPassword) {
        throw new Error('Mật khẩu nhập lại không khớp.')
      }

      await registerAdmin({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone?.trim() || null,
        adminRegistrationCode: values.adminRegistrationCode,
      })

      await Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        text: 'Tài khoản admin đã được tạo. Hãy đăng nhập để tiếp tục.',
      })

      navigate('/admin/login', { replace: true })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại',
        text: error instanceof Error ? error.message : 'Không thể đăng ký admin',
      })
    }
  }

  const password = watch('password')

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Admin Panel</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900">Đăng ký admin</h1>
        <p className="mt-2 text-sm text-zinc-500">Tạo tài khoản quản trị bằng mã đăng ký admin do hệ thống cấp.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="admin-fullName">Họ và tên</label>
            <input
              id="admin-fullName"
              type="text"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
              {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
              {...register('email', { required: 'Vui lòng nhập email' })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="admin-phone">Số điện thoại</label>
            <input
              id="admin-phone"
              type="tel"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
              {...register('phone')}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="admin-password">Mật khẩu</label>
            <input
              id="admin-password"
              type="password"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
              {...register('password', { required: 'Vui lòng nhập mật khẩu', minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' } })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="admin-confirmPassword">Nhập lại mật khẩu</label>
            <input
              id="admin-confirmPassword"
              type="password"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
              {...register('confirmPassword', {
                required: 'Vui lòng nhập lại mật khẩu',
                validate: (value) => value === password || 'Mật khẩu nhập lại không khớp',
              })}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="admin-code">Mã đăng ký admin</label>
            <input
              id="admin-code"
              type="text"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
              {...register('adminRegistrationCode', { required: 'Vui lòng nhập mã đăng ký admin' })}
            />
            {errors.adminRegistrationCode && <p className="mt-1 text-xs text-red-600">{errors.adminRegistrationCode.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký admin'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-3 text-sm text-zinc-600">
          <span>Đã có tài khoản?</span>
          <Link to="/admin/login" className="font-semibold text-red-600 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  )
}

export default AdminRegisterPage

