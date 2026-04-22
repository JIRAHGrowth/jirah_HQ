import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: 'var(--gold)',
        navy: 'var(--navy)',
      },
      fontFamily: {
        serif: ['var(--serif)'],
        sans: ['var(--sans)'],
      },
    },
  },
  plugins: [],
}

export default config
