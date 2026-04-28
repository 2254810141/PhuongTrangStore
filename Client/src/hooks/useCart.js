import { useEffect, useMemo, useState } from 'react'
import useAuthSession from './useAuthSession'
import {
  addCartItem,
  clearCart as clearRemoteCart,
  getCart,
  removeCartItem as removeRemoteCartItem,
  updateCartItem as updateRemoteCartItem,
} from '../services/cartApi'
import { PLACEHOLDER_IMAGE, toAbsoluteImageUrl } from '../utils/product'

const CART_STORAGE_KEY = 'phuongtrang_cart'

function readLocalCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.map((item) => ({
          id: String(item.id ?? item.productId ?? ''),
          productId: Number(item.productId ?? item.id ?? 0),
          name: item.name ?? 'Sản phẩm',
          price: Number(item.price ?? 0),
          image: item.image || PLACEHOLDER_IMAGE,
          quantity: Number(item.quantity ?? 1),
          isContactPrice: Boolean(item.isContactPrice),
        }))
      : []
  } catch {
    return []
  }
}

function saveLocalCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

function normalizeRemoteCartItem(item) {
  return {
    id: String(item.productId ?? item.ProductId ?? item.id ?? item.Id ?? ''),
    productId: Number(item.productId ?? item.ProductId ?? item.id ?? item.Id ?? 0),
    name: item.productName ?? item.ProductName ?? 'Sản phẩm',
    price: Number(item.productPrice ?? item.ProductPrice ?? 0),
    image: toAbsoluteImageUrl(item.productImage ?? item.ProductImage ?? ''),
    quantity: Number(item.quantity ?? item.Quantity ?? 1),
    isContactPrice: false,
  }
}

function normalizeLocalCartItem(product, quantity = 1) {
  return {
    id: String(product.id),
    productId: Number(product.id),
    name: product.name,
    price: Number(product.price ?? 0),
    image: product.image || PLACEHOLDER_IMAGE,
    quantity,
    isContactPrice: Boolean(product.isContactPrice),
  }
}

export default function useCart() {
  const { session } = useAuthSession()
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = Boolean(session?.accessToken)

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems(readLocalCart())
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await getCart()
      setCartItems(Array.isArray(data) ? data.map(normalizeRemoteCartItem) : [])
    } catch {
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    ;(async () => {
      if (isAuthenticated) {
        try {
          const data = await getCart()
          if (active) {
            setCartItems(Array.isArray(data) ? data.map(normalizeRemoteCartItem) : [])
          }
        } catch {
          if (active) {
            setCartItems([])
          }
        } finally {
          if (active) {
            setIsLoading(false)
          }
        }
        return
      }

      if (active) {
        setCartItems(readLocalCart())
        setIsLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      return
    }

    saveLocalCart(cartItems)
  }, [cartItems, isAuthenticated])

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0), [cartItems])

  const handleAddToCart = async (product) => {
    if (!product || product.isContactPrice) {
      return
    }

    if (isAuthenticated) {
      await addCartItem({ productId: Number(product.id), quantity: 1 })
      await refreshCart()
      return
    }

    setCartItems((prev) => {
      const index = prev.findIndex((item) => String(item.id) === String(product.id))

      if (index >= 0) {
        const next = [...prev]
        next[index] = {
          ...next[index],
          quantity: Number(next[index].quantity ?? 0) + 1,
        }
        return next
      }

      return [...prev, normalizeLocalCartItem(product, 1)]
    })
  }

  const handleRemoveItem = async (itemId) => {
    if (isAuthenticated) {
      await removeRemoteCartItem(Number(itemId))
      await refreshCart()
      return
    }

    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(itemId)))
  }

  const handleRemoveItems = async (itemIds = []) => {
    const normalizedIds = [...new Set(itemIds.map((id) => Number(id)).filter((id) => id > 0))]

    if (normalizedIds.length === 0) {
      return
    }

    if (isAuthenticated) {
      for (const itemId of normalizedIds) {
        await removeRemoteCartItem(itemId)
      }

      await refreshCart()
      return
    }

    setCartItems((prev) => prev.filter((item) => !normalizedIds.includes(Number(item.id))))
  }

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await handleRemoveItem(itemId)
      return
    }

    if (isAuthenticated) {
      await updateRemoteCartItem({ productId: Number(itemId), quantity })
      await refreshCart()
      return
    }

    setCartItems((prev) =>
      prev.map((item) => (String(item.id) === String(itemId) ? { ...item, quantity } : item)),
    )
  }

  const clearCart = async () => {
    if (isAuthenticated) {
      await clearRemoteCart()
      setCartItems([])
      return
    }

    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  return {
    cartItems,
    cartCount,
    isLoading,
    refreshCart,
    handleAddToCart,
    handleRemoveItem,
    handleRemoveItems,
    handleUpdateQuantity,
    clearCart,
  }
}

