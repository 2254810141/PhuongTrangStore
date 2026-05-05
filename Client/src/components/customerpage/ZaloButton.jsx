function ZaloButton() {
  const zaloPhone = "0933901128" // Thay bằng số Zalo của bạn
  
  const handleZaloClick = () => {
    // Mở Zalo qua URL scheme
    window.open(`https://zalo.me/${zaloPhone}`, '_blank')
  }

  return (
    <button
      onClick={handleZaloClick}
      className="fixed bottom-20 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-all hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
      aria-label="Nhắn tin Zalo"
    >
      <svg
        className="h-8 w-8 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    </button>
  )
}

export default ZaloButton
