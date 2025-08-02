/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandLight: "#B2B0E8",  // light purple
        brandMid: "#7A85C1",    // medium purple-blue
        brandDark: "#3B38A0",   // dark blue-violet
        
      },
    },
  },
  plugins: [],
};
