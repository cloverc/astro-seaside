const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--shn-color-accent)",
        secondary: "var(--shn-color-secondary)",
        accent: "var(--shn-color-accent)",
        default: "var(--shn-color-text-default)",
      },
      fontFamily: {
        sans: ["var(--shn-font-sans)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--shn-font-serif)", ...defaultTheme.fontFamily.serif],
        heading: ["var(--shn-font-heading)", ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        neg32: "-2rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
