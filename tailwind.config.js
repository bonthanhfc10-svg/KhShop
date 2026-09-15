/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#e63946',
          light: '#ff5a66',
        },
        admin: {
          primary: '#4338CA',
          'primary-hover': '#3730A3',
          'primary-light': '#EEF2FF',
          'primary-muted': '#C7D2FE',
          'primary-ring': 'rgba(67, 56, 202, 0.18)',
          sidebar: '#0B1120',
          'sidebar-hover': '#151D2E',
          'sidebar-active': '#4338CA',
          surface: '#DCE1EB',
          'surface-subtle': '#E8ECF4',
          card: '#F0F2F7',
          'card-elevated': '#FAFBFD',
          'table-header': '#E4E8F0',
          border: '#C8CED9',
          'border-subtle': '#D6DBE5',
          success: '#059669',
          'success-light': '#ECFDF5',
          warning: '#D97706',
          'warning-light': '#FFFBEB',
          danger: '#DC2626',
          'danger-light': '#FEF2F2',
          info: '#2563EB',
          'info-light': '#EFF6FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in-overlay': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'mega-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, -6px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
      },
      animation: {
        'mega-in': 'mega-in 0.25s ease-out both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        pop: 'pop 0.35s ease-out both',
        'slide-in-right': 'slide-in-right 0.3s ease-out both',
        'slide-in-left': 'slide-in-left 0.3s ease-out both',
        'slide-up': 'slide-up 0.3s ease-out both',
        'fade-in-overlay': 'fade-in-overlay 0.3s ease-out both',
        'slide-in': 'slide-in 0.3s ease-out both',
      },
      transitionDelay: {
        150: '150ms',
        300: '300ms',
        450: '450ms',
      },
    },
  },
  plugins: [],
}
