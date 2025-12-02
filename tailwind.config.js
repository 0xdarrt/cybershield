/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "#050505", // Deepest Black
                surface: "#0a0a0a", // Slightly lighter for cards
                primary: "#00ff41", // Matrix Green
                secondary: "#00b8ff", // Cyber Blue
                accent: "#ff003c", // Cyber Red
                warning: "#fcee0a", // Cyber Yellow
                muted: "#525252",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
                display: ['Orbitron', 'sans-serif'], // For headers
            },
            boxShadow: {
                'neon-green': '0 0 5px #00ff41, 0 0 20px rgba(0, 255, 65, 0.3)',
                'neon-blue': '0 0 5px #00b8ff, 0 0 20px rgba(0, 184, 255, 0.3)',
                'neon-red': '0 0 5px #ff003c, 0 0 20px rgba(255, 0, 60, 0.3)',
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scanline': 'scanline 8s linear infinite',
                'glitch': 'glitch 1s linear infinite',
            },
            keyframes: {
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                }
            }
        },
    },
    plugins: [],
}
