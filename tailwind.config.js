/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0b2145',
                secondary: '#102b55',
                accent: '#2f7fd1',
                'accent-hover': '#1f68b2',
                paper: 'var(--color-paper)',
                'paper-2': 'var(--color-paper-2)',
                ink: 'var(--color-ink)',
                'ink-2': 'var(--color-ink-2)',
                muted: 'var(--color-muted)',
                rule: 'var(--color-rule)',
                shade: 'var(--color-shade)',
                light: 'var(--color-light)',
            },
            fontFamily: {
                sans: ['Funnel Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Funnel Display', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                card: 'var(--shadow-card)',
                cast: 'var(--shadow-cast)',
            },
        },
    },
    plugins: [],
}
