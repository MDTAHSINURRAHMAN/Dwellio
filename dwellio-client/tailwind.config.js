/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#373373",
        secondary: "#D6AEE7",
        cardBg:'#F4F5F7',
        titleText: "#131313",
        subtitleText: "#757575",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

