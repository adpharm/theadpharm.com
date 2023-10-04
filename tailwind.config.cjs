/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: true, // or 'media' or 'class'
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      animation: {
        rev: "spin 4s cubic-bezier(.79,.14,.15,.86) infinite",
      },
    },
  },
  plugins: [],
};
