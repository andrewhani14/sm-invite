/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        romance: {
          50: '#f7fbf8',
          100: '#edf6ef',
          200: '#d8ebdd',
          300: '#bdddc7',
          400: '#98c8aa',
          500: '#74b08a',
          600: '#4f916b',
          700: '#3d7557',
          800: '#2f5c45',
          900: '#1f3f30',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
        script: ['"Allura"', 'cursive'],
      },
      boxShadow: {
        glow: '0 16px 40px rgba(69, 122, 93, 0.18)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top right, rgba(237, 246, 239, 0.9), rgba(247, 251, 248, 0.96) 35%, rgba(255, 255, 255, 1) 75%)',
      },
    },
  },
  plugins: [],
}

