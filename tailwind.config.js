/** @type {import('tailwindcss').Config} */
import tailwindcss from '@tailwindcss/vite'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical Blue Palette
        primary: {
          DEFAULT: '#2B6CB0', // User requested
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#2B6CB0',
          600: '#2C5282',
          700: '#2A4365',
          800: '#1A365D',
          900: '#153E75',
        },
        // Medical Teal/Green Palette
        secondary: {
          DEFAULT: '#38B2AC', // User requested
          50: '#E6FFFA',
          100: '#B2F5EA',
          200: '#81E6D9',
          300: '#4FD1C5',
          400: '#38B2AC',
          500: '#319795',
          600: '#2C7A7B',
          700: '#285E61',
          800: '#234E52',
          900: '#1D4044',
        },
        // Neutral & Backgrounds
        background: '#F7FAFC', // User requested
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#1A202C', // User requested
          muted: '#718096',
          light: '#A0AEC0',
        },
        // Semantic Colors
        success: '#48BB78',
        warning: '#ED8936',
        danger: '#E53E3E',
        info: '#4299E1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(43, 108, 176, 0.05), 0 2px 4px -1px rgba(43, 108, 176, 0.03)', // Tinted with primary
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      }
    },
  },
  plugins: [
    tailwindcss(),
  ],
}
