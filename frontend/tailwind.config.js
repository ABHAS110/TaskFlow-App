/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F1117',
          surface: '#1A1D27',
          border: '#2D3148',
          hover: '#252940',
        },
        accent: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        stage: {
          todo: '#3B82F6',
          progress: '#F59E0B',
          done: '#10B981',
        },
        text: {
          primary: '#F1F5F9',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
        'bounce-subtle': 'bounceSubtle 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.5)',
        modal: '0 25px 60px rgba(0, 0, 0, 0.6)',
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
