/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'oled-black': '#000000',
                'matrix-green': '#00FF41',
                'glass-dark': 'rgba(255, 255, 255, 0.03)',
                'glass-border': 'rgba(255, 255, 255, 0.08)',
            },
            fontFamily: {
                sans: ['Satoshi', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
                mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
            },
            boxShadow: {
                'glow-green': '0 0 20px -5px rgba(0, 255, 65, 0.3)',
                'glow-screen': '0 0 50px -10px rgba(0, 255, 65, 0.15)',
            },
            backgroundImage: {
                'circuit': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%23333' stroke-width='0.5' /%3E%3Cpath d='M30 30h40v40h-40z' fill='none' stroke='%23333' stroke-width='0.5' /%3E%3C/svg%3E\")", // Placeholder for now, can be replaced with more complex SVG
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
