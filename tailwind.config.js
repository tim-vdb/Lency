// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [
  //     "./index.html",
  //     "./src/**/*.{js,ts,jsx,tsx,html}", // adapte selon ton projet
  // ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // <-- désactive les layers base de tailwind
  },
};
