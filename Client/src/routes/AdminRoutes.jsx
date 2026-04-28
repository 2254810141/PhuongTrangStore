import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import useAuthSession from '../hooks/useAuthSession'
import AdminLayout from '../components/adminpage/AdminLayout'
import AdminLoginPage from '../components/adminpage/AdminLoginPage'
import AdminRegisterPage from '../components/adminpage/AdminRegisterPage'
import AdminProductPage from '../components/adminpage/AdminProductPage'
import AdminCategoryPage from '../components/adminpage/AdminCategoryPage'
import AdminBrandPage from '../components/adminpage/AdminBrandPage'

function RequireAdmin({ children }) {
  const location = useLocation()
  const { session, isAdmin } = useAuthSession()

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}

function GuestOnly({ children }) {
  const { session, isAdmin } = useAuthSession()

  if (session && isAdmin) {
    return <Navigate to="/admin/products" replace />
  }

  return children
}

function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={
          <GuestOnly>
            <AdminLoginPage />
          </GuestOnly>
        }
      />
      <Route
        path="/admin/register"
        element={
          <GuestOnly>
            <AdminRegisterPage />
          </GuestOnly>
        }
      />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<AdminProductPage />} />
        <Route path="categories" element={<AdminCategoryPage />} />
        <Route path="brands" element={<AdminBrandPage />} />
      </Route>
    
      <Route path="*" element={null} />
    </Routes>
  )
}

export default AdminRoutes

