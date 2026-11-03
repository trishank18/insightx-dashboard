const menuButton = document.querySelector('.insight-menu-toggle');
const navigation = document.querySelector('.insight-nav');

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
