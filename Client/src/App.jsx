import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './components/customerpage/HomePage'
import ProductPage from './components/customerpage/ProductPage'
import AccessoriesPage from './components/customerpage/AccessoriesPage'
import CartPage from './components/customerpage/CartPage'


function App() {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products/laptop" element={<ProductPage />} />
          <Route path="/accessories" element={<AccessoriesPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
