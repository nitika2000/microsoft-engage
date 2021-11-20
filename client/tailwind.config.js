const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        sky: colors.sky,
        blueGray: colors.blueGray,
      },
      keyframes: {
        fadein: {
          "0%": { transform: "scale(0.80); opacity: 0;" },
          "100%": { transform: "scale(1); opacity: 1;" },
        },
        fadeout: {
          "100%": {
            transform: "scale(0.50); opacity: 0; visibility: hidden;",
          },
        },
        "pulse-slow": {
          "50%": {
            transform: "scale(1.05)",
          },
        },
      },
      animation: {
        fadein: "fadein 200ms ease-in-out",
        fadeout: "fadeout 200ms ease-in-out forwards",
        pulseSlow: "pulse-slow 1000ms linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    // ...
  ],
};
