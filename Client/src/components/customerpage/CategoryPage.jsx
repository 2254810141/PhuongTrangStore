import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from './ProductGrid'
import { getProducts } from '../../services/productApi'
import { getCategories } from '../../services/categoryApi'
import { categorySlugMap, getCategoryLabelById } from '../../constants/menuCategories'

function CategoryPage({ onAddToCart = () => {} }) {
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [categoryName, setCategoryName] = useState(getCategoryLabelById(id))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const [productData, categoryData] = await Promise.all([getProducts(), getCategories()])
        if (!mounted) return

        const acceptedCategoryIds = categorySlugMap[id] ?? []
        const normalizedId = Number(id)
        const selectedCategory = categoryData.find((item) => String(item.id) === String(id))

        const filtered = productData.filter((item) => {
          if (!item.isActive) return false
          if (acceptedCategoryIds.length > 0) {
            return acceptedCategoryIds.includes(item.categoryId)
          }

          if (!Number.isNaN(normalizedId)) {
            return item.categoryId === normalizedId
          }

          return true
        })

        setProducts(filtered)
        setCategoryName(selectedCategory?.name ?? getCategoryLabelById(id))
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh mục')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [id])

  const title = useMemo(() => categoryName, [categoryName])

  if (isLoading) {
    return <section className="container-app">Đang tải danh mục...</section>
  }

  if (error) {
    return <section className="container-app text-red-700">{error}</section>
  }

  return (
    <section className="container-app space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600">Danh mục</p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">{title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Tìm thấy {products.length} sản phẩm đang kinh doanh.</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
          Danh mục này chưa có sản phẩm.
        </div>
      ) : (
        <ProductGrid products={products} onAddToCart={onAddToCart} />
      )}
    </section>
  )
}

export default CategoryPage

