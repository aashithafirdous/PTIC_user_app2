/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ptic: {
          dark: '#14253d',
          primary: '#135E69',
          secondary: '#267f86',
          soft: '#c8e6df',
          bg: '#f8f3ea',
          surface: '#fffdf8',
          border: '#e8ded0',
          borderSubtle: '#f1e9df',
          textMuted: '#6f776f',
          // PTIC Dark Palette tokens matching specification
          'dark-bg': '#0A1931',
          'dark-surface': '#102640',
          'dark-card': '#153451',
          'dark-text': '#F6FAFD',
          'dark-textMuted': '#B3CFE5',
          'dark-border': '#294966',
          'dark-action': '#18A999',
          'dark-hover': '#1A3D63',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        heading: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'Poppins', 'system-ui', 'sans-serif'],
        metropolis: ['Metropolis', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        input: '12px',
        btn: '9999px',
        card: '16px',
        modal: '16px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(20, 37, 61, 0.05), 0 1px 2px -1px rgba(20, 37, 61, 0.03)',
        card: '0 2px 10px -2px rgba(20, 37, 61, 0.06), 0 1px 3px -1px rgba(20, 37, 61, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(20, 37, 61, 0.1), 0 3px 6px -2px rgba(20, 37, 61, 0.04)',
        dropdown: '0 12px 30px -4px rgba(20, 37, 61, 0.1), 0 4px 10px -2px rgba(20, 37, 61, 0.04)',
        modal: '0 24px 48px -12px rgba(20, 37, 61, 0.16)',
      },
      spacing: {
        '4.5': '18px',
      },
    },
  },
  plugins: [],
}
