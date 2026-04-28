import { Navigate, Route, Routes } from 'react-router-dom'
import StoreLayout from '../components/layout/StoreLayout'
import HomePage from '../components/customerpage/HomePage'
import ProductPage from '../components/customerpage/ProductPage'
import CartPage from '../components/customerpage/CartPage'
import LoginPage from '../components/customerpage/LoginPage'
import RegisterPage from '../components/customerpage/RegisterPage'
import ForgotPasswordPage from '../components/customerpage/ForgotPasswordPage'
import ProductDetailPage from '../components/customerpage/ProductDetailPage'
import SearchResultsPage from '../components/customerpage/SearchResultsPage'
import CategoryPage from '../components/customerpage/CategoryPage'
import BrandPage from '../components/customerpage/BrandPage'

export default function StoreRoutes({
  cartCount,
  cartItems,
  onAddToCart,
  onRemoveItem,
  onUpdateQuantity,
}) {
  return (
    <Routes>
      <Route path="/" element={<StoreLayout cartCount={cartCount} />}>
        <Route index element={<HomePage onAddToCart={onAddToCart} />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="products" element={<ProductPage onAddToCart={onAddToCart} />} />
        <Route path="products/laptop" element={<Navigate to="/products" replace />} />
        <Route path="products/:productId" element={<ProductDetailPage onAddToCart={onAddToCart} />} />
        <Route path="category/:id" element={<CategoryPage onAddToCart={onAddToCart} />} />
        <Route path="brand/:id" element={<BrandPage onAddToCart={onAddToCart} />} />
        <Route path="search" element={<SearchResultsPage onAddToCart={onAddToCart} />} />
        <Route
          path="cart"
          element={
            <CartPage
              cartItems={cartItems}
              onRemoveItem={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
            />
          }
        />
        
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  )
}

