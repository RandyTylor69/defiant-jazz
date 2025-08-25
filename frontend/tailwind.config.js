/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary:"#E5E6E1",
        secondary: "#D9D9D9"
      },
      fontFamily:{
        HKGrotesk:["Hanken Grotesk"]
      }
    },
  },
  plugins: [],
}

