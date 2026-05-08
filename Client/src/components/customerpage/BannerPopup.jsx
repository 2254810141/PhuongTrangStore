import { useState, useEffect } from 'react'

function BannerPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show banner after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-w-2xl w-full">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-red-600 p-2 text-white shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Đóng banner"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <div className="rounded-xl overflow-hidden shadow-2xl">
          <img
            src="https://res.cloudinary.com/djbupbycd/image/upload/v1777999107/banner1_nj1g6x.png"
            alt="Banner PhươngTrang Store"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}

export default BannerPopup
