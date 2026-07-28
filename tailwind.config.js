/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        romance: {
          50: '#faf7f4',
          100: '#f2ebe4',
          200: '#e5d6c9',
          300: '#d4bba8',
          400: '#b89578',
          500: '#9a7559',
          600: '#806244',
          700: '#6E4F35',
          800: '#583f2a',
          900: '#3d2c1d',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
        script: ['"Allura"', 'cursive'],
      },
      boxShadow: {
        glow: '0 16px 40px rgba(110, 79, 53, 0.18)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top right, rgba(250, 247, 244, 0.9), rgba(252, 249, 246, 0.96) 35%, rgba(255, 255, 255, 1) 75%)',
      },
    },
  },
  plugins: [],
}

