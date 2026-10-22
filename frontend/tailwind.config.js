/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Central Savora-Inspired Premium Editorial Theme Tokens
        theme: {
          bg: '#F3EEE4',         // Warm parchment background
          surface: '#FFFFFF',    // Pure White surface/card
          ink: '#171914',        // Deep ink black headings & accents
          olive: '#74785B',      // Muted olive for active navigation & secondary accents
          oliveHover: '#5F634A', // Deeper olive for hover states
          sandstone: '#D8CDBA',  // Sandstone borders & dividers
          sandstoneSoft: '#E8E2D5', // Secondary soft panel tint
          terracotta: '#A65F43', // Restrained terracotta highlight
          text: '#171914',       // Primary text (ink black)
          muted: '#5D6057',      // Muted body text
          border: '#D8CDBA',     // Sandstone border
          success: '#28734D',    // Semantic success
          warning: '#B7791F',    // Semantic warning
          error: '#B33A32',      // Semantic error
        },
        // Direct named tokens
        parchment: {
          DEFAULT: '#F3EEE4',
          50: '#FAF8F4',
          100: '#F3EEE4',
          200: '#E8E2D5',
          300: '#D8CDBA',
        },
        ink: {
          DEFAULT: '#171914',
          light: '#242721',
          pure: '#11130F',
        },
        olive: {
          DEFAULT: '#74785B',
          50: '#F5F5F0',
          100: '#EAEBE3',
          200: '#D5D7C7',
          300: '#B6B9A1',
          400: '#92967A',
          500: '#74785B',
          600: '#5F634A',
          700: '#4A4D3A',
          800: '#35372A',
          900: '#202119',
        },
        sandstone: {
          DEFAULT: '#D8CDBA',
          50: '#FAF8F4',
          100: '#F3EEE4',
          200: '#E8E2D5',
          300: '#D8CDBA',
          400: '#C2B39A',
          500: '#AB997A',
        },
        terracotta: {
          DEFAULT: '#A65F43',
          50: '#FBF5F2',
          100: '#F6EAE4',
          200: '#ECD5CA',
          300: '#DFB5A3',
          400: '#CA866D',
          500: '#A65F43',
          600: '#8C4D34',
          700: '#733D28',
          800: '#5A2E1E',
          900: '#422013',
        },
        // Backward compatibility mappings
        aahuti: {
          primary: '#74785B',    // Muted Olive
          primaryHover: '#5F634A',
          sage: '#74785B',
          sageSoft: '#E8E2D5',
          terracotta: '#A65F43',
          bg: '#F3EEE4',
          surface: '#FFFFFF',
          text: '#171914',
          muted: '#5D6057',
          border: '#D8CDBA',
        },
        sage: {
          50: '#FAF8F4',
          100: '#E8E2D5',
          200: '#D8CDBA',
          500: '#74785B',
          600: '#74785B',
          700: '#5F634A',
          800: '#171914',
          900: '#171914',
        },
        forest: {
          50: '#FAF8F4',
          100: '#E8E2D5',
          200: '#D8CDBA',
          600: '#74785B',
          700: '#74785B',
          800: '#5F634A',
          900: '#171914',
        },
        cream: {
          50: '#FAF8F4',
          100: '#F3EEE4',
          200: '#D8CDBA',
          300: '#C2B39A',
          800: '#171914',
        },
        veyora: {
          forest: '#74785B',
          deep: '#5F634A',
          mint: '#E8E2D5',
          mintLight: '#F3EEE4',
          ivory: '#F3EEE4',
          white: '#FFFFFF',
          charcoal: '#171914',
          orange: '#A65F43',
          muted: '#5D6057',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(23, 25, 20, 0.03)',
        'card': '0 4px 20px -2px rgba(23, 25, 20, 0.05), 0 2px 6px -1px rgba(23, 25, 20, 0.02)',
        'elevated': '0 12px 32px -4px rgba(23, 25, 20, 0.08), 0 4px 12px -2px rgba(23, 25, 20, 0.03)',
      }
    },
  },
  plugins: [],
}
