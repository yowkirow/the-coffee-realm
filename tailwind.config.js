/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#E3F4E9', // Soft Mint
                surface: '#FFFFFF',
                'surface-hover': '#F9FAFB',
                primary: '#15803d', // Emerald 700
                'primary-hover': '#166534', // Emerald 800
                accent: '#15803d',
                text: '#1F2937', // Gray 800
                'text-muted': '#6B7280', // Gray 500
                border: '#E5E7EB', // Gray 200
            },
            fontFamily: {
                sans: ['var(--font-sans)'],
                display: ['var(--font-display)'],
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
            }
        },
    },
    plugins: [],
}
