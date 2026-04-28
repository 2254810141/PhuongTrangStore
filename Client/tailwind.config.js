/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#b91c1c',
          dark: '#111111',
          steel: '#1f2937',
          ember: '#ef4444',
        },
      },
      boxShadow: {
        panel: '0 10px 35px rgba(0, 0, 0, 0.18)',
      },
      backgroundImage: {
        'brand-grid':
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '24px 24px',
      },
    },
  },
  plugins: [],
}

