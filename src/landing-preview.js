const menuButton = document.querySelector('.insight-menu-toggle');
const navigation = document.querySelector('.insight-nav');
const themeButton = document.querySelector('.insight-theme-toggle');
const page = document.querySelector('.insight-page');

const applyTheme = (dark) => {
  page?.classList.toggle('insight-light', !dark);
  document.documentElement.classList.toggle('dark', dark);
  themeButton?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton?.setAttribute('aria-pressed', String(dark));
};

let darkTheme = false;
try { darkTheme = window.localStorage.getItem('insightx-theme') === 'dark'; } catch {}
applyTheme(darkTheme);
themeButton?.addEventListener('click', () => {
  darkTheme = !darkTheme;
  applyTheme(darkTheme);
  try { window.localStorage.setItem('insightx-theme', darkTheme ? 'dark' : 'light'); } catch {}
});

menuButton?.addEventListener('click', () => {
  const open = navigation?.classList.toggle('insight-nav-open') ?? false;
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuButton.setAttribute('aria-expanded', String(open));
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('insight-nav-open');
  menuButton?.setAttribute('aria-label', 'Open menu');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
