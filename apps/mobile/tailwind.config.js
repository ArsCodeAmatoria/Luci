/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B82", // Pink accent
          dark: "#FF3E5E",
          light: "#FF99A9",
        },
        secondary: {
          DEFAULT: "#6C7AE0", // Blue accent
          dark: "#4A5AD0",
          light: "#8E9BF0",
        },
        background: {
          DEFAULT: "#121212", // Dark background
          lighter: "#1E1E1E",
          card: "#252525",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#ABABAB",
          muted: "#7A7A7A",
        },
      },
    },
  },
  plugins: [],
}

