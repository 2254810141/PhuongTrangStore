import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { loginAdmin } from '../../services/adminApi'
import { saveAuthSession } from '../../utils/authSession'

function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const response = await loginAdmin(values)
      const role = String(response?.user?.role ?? '').toLowerCase()

      if (role !== 'admin') {
        throw new Error('Tài khoản này không có quyền admin.')
      }

      saveAuthSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt,
        user: response.user,
      })

      await Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công',
        text: 'Chào mừng bạn đến với Admin Panel.',
        confirmButtonText: 'Đi tới dashboard',
      })

      const redirectTo = location.state?.from?.pathname ?? '/admin/products'
      navigate(redirectTo, { replace: true })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: error instanceof Error ? error.message : 'Không thể đăng nhập admin',
      })
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Admin Panel</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900">Đăng nhập quản trị</h1>
        <p className="mt-2 text-sm text-zinc-500">Đăng nhập bằng tài khoản admin để quản lý sản phẩm, danh mục và thương hiệu.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              placeholder="Nhập email admin"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
              {...register('email', { required: 'Vui lòng nhập email' })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700" htmlFor="admin-password">
              Mật khẩu
            </label>
            <input
              id="admin-password"
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-red-500"
              {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-3 text-sm text-zinc-600">
          <span>Chưa có tài khoản admin?</span>
          <Link to="/admin/register" className="font-semibold text-red-600 hover:underline">
            Đăng ký admin
          </Link>
        </div>
      </div>
    </main>
  )
}

export default AdminLoginPage

