const THEME_KEY = 'orbit-theme';

function applyTheme(tema) {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    root.setAttribute('data-theme', tema === 'system' ? (systemDark ? 'dark' : 'light') : tema);

    document.querySelectorAll('.btn-tema').forEach (btn => {
        btn.classList.toggle('active', btn.dataset.themeValue === tema);
    });
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'system';
    applyTheme(saved);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if ((localStorage.getItem(THEME_KEY) || 'system') === 'system') {
            applyTheme('system');
        }
    });

    document.querySelectorAll('.btn-tema').forEach (btn => {
        btn.addEventListener('click', () => {
            const tema = btn.dataset.themeValue;
            localStorage.setItem(THEME_KEY, tema);
            applyTheme(tema);
        });
    });
}

document.addEventListener('DOMContentLoaded', initTheme);
