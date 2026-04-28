import AdminSimpleCrudPage from './AdminSimpleCrudPage'
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../services/adminApi'

function AdminCategoryPage() {
  return (
    <AdminSimpleCrudPage
      title="Quản lý Danh mục"
      description="Danh sách danh mục"
      entityLabel="danh mục"
      emptyLabel="Thêm mới, sửa, xóa danh mục để đồng bộ với dữ liệu sản phẩm."
      loadItems={getAdminCategories}
      createItem={createAdminCategory}
      updateItem={updateAdminCategory}
      deleteItem={deleteAdminCategory}
    />
  )
}

export default AdminCategoryPage

