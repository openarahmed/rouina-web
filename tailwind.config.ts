import type { Config } from 'tailwindcss'

const config: Config = {
  // darkMode: 'class',  <-- এই লাইনটি মুছে ফেলুন বা কমেন্ট আউট করুন
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config