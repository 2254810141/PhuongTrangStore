import { useEffect, useMemo, useState } from 'react'

const CART_STORAGE_KEY = 'phuongtrang_cart'

export default function useCart() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems])

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const index = prev.findIndex((item) => String(item.id) === String(product.id))

      if (index >= 0) {
        const next = [...prev]
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + 1,
        }
        return next
      }

      return [
        ...prev,
        {
          id: String(product.id),
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })
  }

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(itemId)))
  }

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId)
      return
    }

    setCartItems((prev) =>
      prev.map((item) => (String(item.id) === String(itemId) ? { ...item, quantity } : item)),
    )
  }

  return {
    cartItems,
    cartCount,
    handleAddToCart,
    handleRemoveItem,
    handleUpdateQuantity,
  }
}

