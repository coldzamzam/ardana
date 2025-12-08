export type Appearance = 'light' | 'dark' | 'system';

// const prefersDark = () => {
//     if (typeof window === 'undefined') {
//         return false;
//     }

//     return window.matchMedia('(prefers-color-scheme: dark)').matches;
// };

// const setCookie = (name: string, value: string, days = 365) => {
//     if (typeof document === 'undefined') {
//         return;
//     }

//     const maxAge = days * 24 * 60 * 60;
//     document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
// };

const applyTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

export function initializeTheme() {
    applyTheme();
}

export function useAppearance() {
    const appearance = 'light';

    return { appearance } as const;
}
