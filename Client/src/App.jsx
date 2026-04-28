import { BrowserRouter as Router } from 'react-router-dom'
import StoreRoutes from './routes/StoreRoutes'
import AdminRoutes from './routes/AdminRoutes'
import useCart from './hooks/useCart'

function App() {
  const { cartItems, cartCount, handleAddToCart, handleRemoveItem, handleUpdateQuantity } = useCart()

  return (
    <Router>
      <StoreRoutes
        cartCount={cartCount}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
      <AdminRoutes />
    </Router>
  )
}

export default App
