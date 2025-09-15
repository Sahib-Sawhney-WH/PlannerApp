/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'bg': 'hsl(var(--bg))',
        'bg-elev1': 'hsl(var(--bg-elev1))',
        'bg-elev2': 'hsl(var(--bg-elev2))',
        'text': 'hsl(var(--text))',
        'muted': 'hsl(var(--muted))',
        'subtle': 'hsl(var(--subtle))',
        'accent': 'hsl(var(--accent))',
        'success': 'hsl(var(--success))',
        'warn': 'hsl(var(--warn))',
        'danger': 'hsl(var(--danger))',
        'border': 'hsl(var(--border))',
        'ring': 'hsl(var(--ring))',
        'card': 'hsl(var(--card))',
        
        // Tag colors
        'tag-impl': 'hsl(var(--tag-impl))',
        'tag-presales': 'hsl(var(--tag-presales))',
        'tag-signed': 'hsl(var(--tag-signed))',
        
        // Status colors
        'todo': 'hsl(var(--todo))',
        'doing': 'hsl(var(--doing))',
        'blocked': 'hsl(var(--blocked))',
        'done': 'hsl(var(--done))',
      },
      fontFamily: {
        'sans': ['Inter', 'Segoe UI Variable', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'base': ['15px', '1.5'],
        'lg': ['16px', '1.5'],
      },
      borderRadius: {
        'DEFAULT': 'var(--radius)',
        'pill': '9999px',
      },
      boxShadow: {
        'DEFAULT': 'var(--shadow)',
        'focus': 'var(--focus)',
      },
      spacing: {
        '18': '4.5rem', // 72px
        '60': '15rem',  // 240px
        '70': '17.5rem', // 280px
        '120': '30rem',  // 480px
        '140': '35rem',  // 560px
      },
      animation: {
        'fade-in': 'fadeIn 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slide-in': 'slideIn 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'scale-in': 'scaleIn 120ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      maxWidth: {
        'prose': '72ch',
      },
    },
  },
  plugins: [],
}

