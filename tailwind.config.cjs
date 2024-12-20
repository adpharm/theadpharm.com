/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: true, // or 'media' or 'class'
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      animation: {
        rev: "spin 4s cubic-bezier(.79,.14,.15,.86) infinite",
        "slide-200": "slide-200 50s linear 4 alternate",
        "slide-300": "slide-300 50s linear 4 alternate",
        "slide-400": "slide-400 50s linear 4 alternate",
        pawn: "pawn 4s cubic-bezier(.86,0,.07,1) infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "fade-in": "fade-in 1s ease-in-out",
        "fade-in-quick": "fade-in 0.3s ease-in-out",
        "fade-in-2": "fade-in 2s ease-in-out",
        "fade-in-up": "fade-in-up 1s ease-in-out",
        bounce2: "bounce2 2s cubic-bezier(.55,.06,.68,.19) infinite",
        "slide-in-from-right": "slide-in-from-right 0.3s forwards",
        "slide-out-to-left": "slide-out-to-left 0.3s forwards",
        "slide-in-from-left": "slide-in-from-left 0.3s forwards",
        "slide-out-to-right": "slide-out-to-right 0.3s forwards",
      },
      keyframes: {
        "slide-200": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
        "slide-300": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-66.6%)",
          },
        },
        "slide-400": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-75%)",
          },
        },
        pawn: {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "50%": {
            transform: "translateX(20px)",
          },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(3deg)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        bounce2: {
          "0%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        "slide-in-from-right": {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "slide-out-to-left": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
        "slide-in-from-left": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "slide-out-to-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
    },
  },
  plugins: [require("tailwindcss-animate")],
};
