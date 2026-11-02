/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#0f172a", muted: "#64748b", brand: "#635bff" },
      boxShadow: { soft: "0 8px 30px rgba(15, 23, 42, .06)" }
    }
  },
  plugins: []
};
