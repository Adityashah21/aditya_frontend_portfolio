/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      colors: {
        cyber: {
          bg:      "#0a0e1a",
          surface: "#111827",
          card:    "#0d1424",
          primary: "#00f0ff",
          secondary:"#7c3aed",
          accent:  "#ff00ff",
          green:   "#00ff88",
          text:    "#e0f2fe",
          muted:   "rgba(224,242,254,0.45)",
          dim:     "rgba(224,242,254,0.15)",
        },
      },
      animation: {
        "pulse-glow":  "pulseGlow 2s ease-in-out infinite",
        "float":       "float 6s ease-in-out infinite",
        "scanline":    "scanline 8s linear infinite",
        "glitch":      "glitch 3s infinite",
        "type":        "typewriter 3s steps(30) forwards",
        "blink":       "blink 1s step-end infinite",
        "slide-up":    "slideUp 0.7s ease forwards",
        "fade-in":     "fadeIn 0.6s ease forwards",
        "spin-slow":   "spin 8s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px #00f0ff44, 0 0 40px #00f0ff22" },
          "50%":     { boxShadow: "0 0 40px #00f0ff88, 0 0 80px #00f0ff44" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-16px)" },
        },
        scanline: {
          "0%":   { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100vh" },
        },
        glitch: {
          "0%,90%,100%": { transform: "translate(0)" },
          "92%": { transform: "translate(-3px, 1px)", filter: "hue-rotate(90deg)" },
          "94%": { transform: "translate(3px, -1px)", filter: "hue-rotate(-90deg)" },
          "96%": { transform: "translate(-2px, 2px)" },
          "98%": { transform: "translate(2px, -2px)" },
        },
        typewriter: {
          from: { width: "0" },
          to:   { width: "100%" },
        },
        blink: {
          "0%,100%": { opacity: 1 },
          "50%":     { opacity: 0 },
        },
        slideUp: {
          from: { transform: "translateY(40px)", opacity: 0 },
          to:   { transform: "translateY(0)",    opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
      backgroundImage: {
        "grid-cyber": "linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};