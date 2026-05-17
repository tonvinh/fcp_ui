/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fpt: {
          orange: '#F26D21',
          blue: '#163172',
          lightBlue: '#1E56A0',
          darkBlue: '#0D214F'
        }
      }
    },
  },
  plugins: [],
}
