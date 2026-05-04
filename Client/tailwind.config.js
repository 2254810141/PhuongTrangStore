/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: '#92400e',
          darkBrown: '#78350f',
          lightYellow: '#fef3c7',
          amber: '#d97706',
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

