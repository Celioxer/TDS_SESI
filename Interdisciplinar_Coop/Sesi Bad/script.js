const navbar = document.getElementById('navbar');
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
const links = menu.querySelectorAll('a');

function setMenu(aberto) {
    menu.classList.toggle('aberto', aberto);
    burger.setAttribute('aria-expanded', aberto);
    burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

burger.addEventListener('click', () => {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
});

links.forEach(link => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
});

// Barra ganha fundo ao rolar a página
function atualizarBarra() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', atualizarBarra, { passive: true });
atualizarBarra();

// Destaca no menu a seção que está na tela
const secoes = [...links]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

const observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return;
        links.forEach(a => {
            a.classList.toggle('ativo', a.getAttribute('href') === '#' + entrada.target.id);
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' });

secoes.forEach(secao => observador.observe(secao));
