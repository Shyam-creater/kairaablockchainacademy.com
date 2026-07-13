// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // COLOR SYSTEM
      colors: {
        // Primary - Trust & Tech (Blue)
        primary: {
          50: '#F0F5FF',
          100: '#E6F0FF',
          200: '#CCE0FF',
          300: '#99BFFF',
          400: '#669FFF',
          500: '#0066FF', // Main primary
          600: '#0052CC',
          700: '#003D99',
          800: '#002E73',
          900: '#001F4D',
        },
        // Secondary - Innovation (Cyan)
        secondary: {
          50: '#E0F7FF',
          100: '#B3ECFF',
          200: '#80E0FF',
          300: '#4DD9FF',
          400: '#00D4FF', // Main secondary
          500: '#00BFFF',
          600: '#00A8CC',
          700: '#008099',
          800: '#005966',
          900: '#003633',
        },
        // Accent - Energy (Orange-Red)
        accent: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD1B3',
          300: '#FFAA80',
          400: '#FF6B35', // Main accent
          500: '#FF5722',
          600: '#E64A19',
          700: '#CC3D00',
          800: '#992E00',
          900: '#661F00',
        },
        // Semantic Colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#145231',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Neutral Colors
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },

      // TYPOGRAPHY
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Headings
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.5px' }],
        'h2': ['36px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.25px' }],
        'h3': ['28px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['20px', { lineHeight: '1.5', fontWeight: '600' }],
        'h6': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        // Body
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.7' }],
        'body-sm': ['14px', { lineHeight: '1.6' }],
        // Labels & captions
        'label': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // SPACING SCALE
      spacing: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '48px',
        '5xl': '64px',
      },

      // BORDER RADIUS
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },

      // SHADOWS
      boxShadow: {
        none: 'none',
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },

      // TRANSITIONS
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // BREAKPOINTS
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      // GRID
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(280px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(280px, 1fr))',
      },

      // ANIMATION
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [
    // Custom plugin for responsive text scaling
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
