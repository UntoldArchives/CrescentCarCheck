import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        background: '#0A0A0A',
        surface: '#111111',
        card: '#1A1A1A',
        'card-hover': '#1F1F1F',
        border: '#2A2A2A',
        'border-hover': '#3A3A3A',
        accent: '#FFC600',
        'accent-hover': '#E6B200',
        'accent-muted': 'rgba(255,198,0,0.08)',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        'text-muted': '#555555',
        'light-bg': '#F9F9F9',
        'light-surface': '#F2F2F2',
        'light-card': '#FFFFFF',
        'light-border': '#E5E5E5',
        'light-border-hover': '#CCCCCC',
        'light-text': '#0A0A0A',
        'light-text-secondary': '#444444',
        'light-text-muted': '#888888',
        success: '#22C55E',
        'success-muted': 'rgba(34,197,94,0.1)',
        error: '#EF4444',
        'error-muted': 'rgba(239,68,68,0.1)',
        warning: '#F59E0B',
        'warning-muted': 'rgba(245,158,11,0.1)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-xs': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        card: '14px',
        'card-lg': '20px',
        button: '9999px',
        input: '10px',
        tag: '6px',
      },
      boxShadow: {
        card: '0 0 0 1px #2A2A2A',
        'card-hover': '0 0 0 1px #FFC600, 0 8px 32px rgba(255,198,0,0.06)',
        'input-focus': '0 0 0 3px rgba(255,198,0,0.2)',
        'input-error': '0 0 0 3px rgba(239,68,68,0.2)',
        glow: '0 0 40px rgba(255,198,0,0.15)',
        'glow-sm': '0 0 20px rgba(255,198,0,0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'fade-in-down': 'fadeInDown 0.4s ease forwards',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.32,0.72,0,1) forwards',
        'slide-out-right': 'slideOutRight 0.3s cubic-bezier(0.32,0.72,0,1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.32,0.72,0,1) forwards',
        'pulse-ring': 'pulseRing 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'bounce-y': 'bounceY 1.5s ease-in-out infinite',
        'draw-check': 'drawCheck 0.6s ease forwards 0.2s',
        'count-up': 'fadeInUp 0.6s ease forwards',
        'shimmer': 'shimmer 1.8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutRight: {
          from: { opacity: '1', transform: 'translateX(0)' },
          to: { opacity: '0', transform: 'translateX(100%)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '70%': { transform: 'scale(1.7)', opacity: '0' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        drawCheck: {
          from: { strokeDashoffset: '100' },
          to: { strokeDashoffset: '0' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
export default config
