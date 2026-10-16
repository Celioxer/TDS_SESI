const navbar = document.getElementById('navbar');
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
const links = menu.querySelectorAll('a');
function setMenu(open) {
  menu.classList.toggle('aberto', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
links.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
function updateNav() {
  const isScrolled = window.scrollY > 35;
  navbar.style.background = isScrolled ? 'rgba(36,61,50,.97)' : 'transparent';
  navbar.style.boxShadow = isScrolled ? '0 5px 25px #10251a22' : 'none';
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();
const sections = [...links].map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('ativo', link.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-42% 0px -50% 0px' });
  sections.forEach(section => observer.observe(section));
}
