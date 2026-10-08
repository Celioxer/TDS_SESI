/**
 * Script de Interatividade - Landing Page Witmarsum
 */

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    // 1. Efeito de Scroll no Navbar (Glassmorphism e Altura)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
})
    // 2. Menu Mobile (Toggle)
    const toggleMenu = () => {
        navLinks.classList.toggle('nav-active');
        
        // Animação dos links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Animação do ícone Burger
        burger.classList.toggle('toggle');
    };

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    // Fechar menu ao clicar em um link (Mobile)
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                toggleMenu();
            }
        });
    });

    // 3. Scroll Suave (Smooth Scroll) para Ancôcoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Observer de Revelação (Scroll Reveal)
    // Faz as seções aparecerem suavemente enquanto o usuário desce a página
    const observerOptions = {
        threshold: 0.15, // Inicia a animação quando 15% da seção estiver visível
        rootMargin: "0px 0px -50px 0px"}