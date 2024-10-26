/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-primary': '#063e50',
        'seasalt': '#F8FAFA',
        'eerie-black': '#212529',
        'outer-space': '#495057',
        'french-grey': '#ADB5BD',
        'platinum': '#DEE2E6',
        'white_custom': '#FFFFFF',
      },
    },
  },
  plugins: [],
}

