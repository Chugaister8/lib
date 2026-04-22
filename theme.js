// src/scripts/utils/theme.js

const THEME_KEY = 'atlas-theme';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getTheme = () =>
  localStorage.getItem(THEME_KEY) ?? getSystemTheme();

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
};

const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
};

const initTheme = () => {
  setTheme(getTheme());
};

export { initTheme, toggleTheme, getTheme };
