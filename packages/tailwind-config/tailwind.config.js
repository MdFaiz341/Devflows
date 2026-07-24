/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // packages content
    '../../packages/**/*.{js,ts,jx,tsx}',
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
        colors: {
            df: {
                bg:       "#080c14",
                bg2:      "#0d1220",
                surface:  "#151e2d",
                surface2: "#1a2538",
                border:   "#1f2d42",
                border2:  "#253550",
                text:     "#f0f4ff",
                text2:    "#8ba3c7",
                text3:    "#4a6080",
                accent:   "#3b82f6",
                accent2:  "#6366f1",
                accent3:  "#22d3ee",
                green:    "#22c55e",
                amber:    "#f59e0b",
                pink:     "#ec4899",
            },
        },
        fontFamily: {
            sans: ["Space Grotesk", "sans-serif"],
            mono: ["JetBrains Mono", "monospace"],
        },
        animation: {
            "fade-up":    "fadeUp 0.8s ease both",
            "shimmer":      "shimmer 4s linear infinite",
            "glow":         "glow 3s ease-in-out infinite",
            "orb1":         "orb1 20s ease-in-out infinite",
            "orb2":         "orb2 25s ease-in-out infinite",
            "orb3":         "orb3 18s ease-in-out infinite",
            "blink":        "blink 1s ease-in-out infinite",
            "blink-slow": "blink 1s 0.5s ease-in-out infinite",
            "marquee":      "marquee 25s linear infinite",
            "ping-slow":  "pingSlow 1.5s ease-out infinite",
            "dot-move":   "dotMove 1.2s ease-in-out infinite",
            "slide-in":   "slideRight 0.4s ease both",
        },
        keyframes: {
            fadeUp: {
                from: { opacity: "0", transform: "translateY(32px)" },
                to:   { opacity: "1", transform: "translateY(0)" },
            },
            shimmer: {
                from: { backgroundPosition: "200% center" },
                to:   { backgroundPosition: "-200% center" },
            },
            glow: {
                "0%,100%": { boxShadow: "0 0 20px rgba(59,130,246,0.2)" },
                "50%":     { boxShadow: "0 0 40px rgba(99,102,241,0.4)" },
            },
            orb1: {
                "0%,100%": { transform: "translate(0,0)" },
                "33%":     { transform: "translate(60px,-40px)" },
                "66%":     { transform: "translate(-40px,30px)" },
            },
            orb2: {
                "0%,100%": { transform: "translate(0,0)" },
                "33%":     { transform: "translate(-50px,50px)" },
                "66%":     { transform: "translate(70px,-30px)" },
            },
            orb3: {
                "0%,100%": { transform: "translate(0,0)" },
                "33%":     { transform: "translate(40px,60px)" },
                "66%":     { transform: "translate(-60px,-20px)" },
            },
            blink: {
                "0%,100%": { opacity: "1" },
                "50%":     { opacity: "0" },
            },
            marquee: {
                from: { transform: "translateX(0)" },
                to:   { transform: "translateX(-50%)" },
            },
            pingSlow: {
                "0%":   { transform: "scale(1)", opacity: "1" },
                "100%": { transform: "scale(2.5)", opacity: "0" },
            },
            dotMove: {
                "0%":   { opacity: "0", transform: "scale(0.5)" },
                "50%":  { opacity: "1", transform: "scale(1)" },
                "100%": { opacity: "0", transform: "scale(0.5)" },
            },
            slideRight: {
                from: { transform: "translateX(-8px)", opacity: "0" },
                to:   { transform: "translateX(0)", opacity: "1" },
            },
        },
        boxShadow: {
            window:   "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.1) inset",
            card:     "0 24px 80px rgba(0,0,0,0.6)",
            btn:      "0 16px 40px rgba(59,130,246,0.45)",
            featured: "0 0 0 1px rgba(59,130,246,0.2), 0 24px 60px rgba(59,130,246,0.15)",
        },
    },
  },
  plugins: [],
}