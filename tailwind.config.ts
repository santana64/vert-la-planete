import type { Config } from "tailwindcss";

/**
 * Palette + type scale ported verbatim from the "Vert La Planète" design template.
 * The canonical design system lives as CSS custom properties in globals.css; these
 * tokens mirror them so Tailwind utilities and the hand-written CSS stay in sync.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          900: "#091f12", // --f
          800: "#12321e", // --m
          700: "#1a5230", // --s
          600: "#267a46", // --fn
          500: "#3daa62", // --l (leaf accent)
          300: "#7ecb99", // --mi (mint)
          200: "#bde5cd", // --dw (dew / borders)
          100: "#e4f5eb", // --fo (foam)
          50: "#f0f8f2" // --pp (pale)
        },
        ink: {
          DEFAULT: "#263d2d", // --st
          muted: "#4e6e58", // --pb
          subtle: "#8faa96" // --sd
        },
        amber: {
          ink: "#a85e0a", // --am
          soft: "#fde5b8" // --ams
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
