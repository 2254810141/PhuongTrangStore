import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './components/customerpage/HomePage'
import ProductPage from './components/customerpage/ProductPage'
import AccessoriesPage from './components/customerpage/AccessoriesPage'
import CartPage from './components/customerpage/CartPage'
import LoginPage from './components/customerpage/LoginPage'
import RegisterPage from './components/customerpage/RegisterPage'
import ForgotPasswordPage from './components/customerpage/ForgotPasswordPage'
import ProductDetailPage from './components/customerpage/ProductDetailPage'
import AccessoryDetailPage from './components/customerpage/AccessoryDetailPage'
import SearchResultsPage from './components/customerpage/SearchResultsPage'


function App() {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products/laptop" element={<ProductPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/accessories" element={<AccessoriesPage />} />
          <Route path="/accessories/:accessoryId" element={<AccessoryDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
