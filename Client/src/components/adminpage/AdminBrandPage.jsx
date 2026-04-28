import AdminSimpleCrudPage from './AdminSimpleCrudPage'
import { createAdminBrand, deleteAdminBrand, getAdminBrands, updateAdminBrand } from '../../services/adminApi'

function AdminBrandPage() {
  return (
    <AdminSimpleCrudPage
      title="Quản lý Thương hiệu"
      description="Danh sách thương hiệu"
      entityLabel="thương hiệu"
      emptyLabel="Thêm mới, sửa, xóa thương hiệu để hiển thị đồng bộ với bảng Brand."
      loadItems={getAdminBrands}
      createItem={createAdminBrand}
      updateItem={updateAdminBrand}
      deleteItem={deleteAdminBrand}
    />
  )
}

export default AdminBrandPage

