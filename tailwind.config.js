/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4E6E81", // GitKraken primary color
        secondary: "#A2B5C6", // Secondary color
        accent: "#F1F1F1", // Accent color for text
        background: "#1E1E1E", // Dark background
        surface: "#2A2A2A", // Surface color for cards
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
