/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                'surface-hover': 'var(--color-surface-hover)',
                primary: 'var(--color-primary)',
                'primary-hover': 'var(--color-primary-hover)',
                accent: 'var(--color-accent)',
                text: 'var(--color-text)',
                'text-muted': 'var(--color-text-muted)',
                border: 'var(--color-border)',
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
