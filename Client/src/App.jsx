import { BrowserRouter as Router } from 'react-router-dom'
import StoreRoutes from './routes/StoreRoutes'
import AdminRoutes from './routes/AdminRoutes'
import useCart from './hooks/useCart'

function App() {
  const {
    cartItems,
    cartCount,
    refreshCart,
    handleAddToCart,
    handleRemoveItem,
    handleRemoveItems,
    handleUpdateQuantity,
    clearCart,
  } = useCart()

  return (
    <Router>
      <StoreRoutes
        cartCount={cartCount}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveItem={handleRemoveItem}
        onRemoveItems={handleRemoveItems}
        onRefreshCart={refreshCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={clearCart}
      />
      <AdminRoutes />
    </Router>
  )
}

export default App
