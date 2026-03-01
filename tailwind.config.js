/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'orb-move': 'orbMove 20s infinite alternate cubic-bezier(0.45, 0.05, 0.55, 0.95)',
                'bounce-slow': 'bounce 3s infinite',
                'progress-shrink': 'progressShrink 5s linear forwards',
            },
            keyframes: {
                orbMove: {
                    '0%': { transform: 'translate(0, 0) scale(1)' },
                    '100%': { transform: 'translate(100px, 50px) scale(1.1)' },
                },
                progressShrink: {
                    '0%': { transform: 'scaleX(1)' },
                    '100%': { transform: 'scaleX(0)' },
                }
            }
        },
    },
    plugins: [],
}
