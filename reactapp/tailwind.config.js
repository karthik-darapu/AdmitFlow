module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          content: 'var(--base-content)',
        },
      },
      textColor: {
        DEFAULT: 'var(--base-content)',
        'base-content': 'var(--base-content)',
        'base-content-secondary': 'var(--base-content-secondary)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          '--base-content': '#1f2937',
          '--base-content-secondary': '#4b5563',
          'primary': '#1d4ed8',
          'primary-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f3f4f6',
          'base-300': '#e5e7eb',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          '--base-content': '#e5e7eb',
          '--base-content-secondary': '#9ca3af',
          'primary': '#3b82f6',
          'primary-content': '#ffffff',
          'base-100': '#1f2937',
          'base-200': '#111827',
          'base-300': '#374151',
        },
      },
    ],
  },
  darkMode: 'class',
}