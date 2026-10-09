/* ==========================================================================
   Parque Estadual de Vila Velha — Interações
   ========================================================================== */
(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {

        /* ---------------- Referências ---------------- */
        const navbar      = document.getElementById('navbar');
        const scrollBar   = document.getElementById('scrollBar');
        const tabSections = Array.from(document.querySelectorAll('.tab-section'));
        const menuToggle  = document.getElementById('menuToggle');
        const mobileMenu  = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const backToTop   = document.getElementById('backToTop');
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* Todas as "âncoras de aba" (nav desktop, mobile, botões, logo...) */
        const tabTriggers = () => document.querySelectorAll('[data-tab]');

        /* =========================================================
           1) Navegação por abas
           ========================================================= */
        const showTab = (id, { scroll = true } = {}) => {
            const target = document.getElementById(id);
            if (!target) return;

            tabSections.forEach(section => section.classList.remove('active'));
            target.classList.add('active');

            tabTriggers().forEach(trigger => {
                trigger.classList.toggle('active', trigger.getAttribute('data-tab') === id);
            });

            if (history.replaceState) {
                history.replaceState(null, '', '#' + id);
            }

            if (scroll) {
                window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
            }

            requestAnimationFrame(() => {
                revealInView(target);
                initCounters(target);
            });
        };

        document.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-tab]');
            if (!trigger) return;

            event.preventDefault();
            showTab(trigger.getAttribute('data-tab'));
            closeMenu();
        });

        /* =========================================================
           2) Menu mobile
           ========================================================= */
        const openMenu = () => {
            mobileMenu.classList.add('open');
            menuOverlay.classList.add('show');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };

        function closeMenu() {
            if (!mobileMenu.classList.contains('open')) return;
            mobileMenu.classList.remove('open');
            menuOverlay.classList.remove('show');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
        });

        menuOverlay.addEventListener('click', closeMenu);

        /* =========================================================
           3) Barra de progresso + navbar + voltar ao topo
           ========================================================= */
        let ticking = false;

        const onScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            if (scrollBar) scrollBar.style.width = progress.toFixed(2) + '%';

            navbar.classList.toggle('scrolled', scrollTop > 20);
            if (backToTop) backToTop.classList.toggle('show', scrollTop > 500);

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
            });
        }

        /* =========================================================
           4) Revelação ao rolar
           ========================================================= */
        const revealObserver = 'IntersectionObserver' in window
            ? new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
            : null;

        function observeReveals(scope = document) {
            const items = scope.querySelectorAll('.reveal:not(.visible)');
            if (!revealObserver) {
                items.forEach(el => el.classList.add('visible'));
                return;
            }
            items.forEach(el => revealObserver.observe(el));
        }

        function revealInView(scope) {
            if (!revealObserver) return;
            scope.querySelectorAll('.reveal:not(.visible)').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.92) {
                    el.classList.add('visible');
                } else {
                    revealObserver.observe(el);
                }
            });
        }

        /* =========================================================
           5) Contadores animados
           ========================================================= */
        const formatNumber = (n) => n.toLocaleString('pt-BR');

        const animateCounter = (el) => {
            if (el.dataset.counted === '1') return;
            el.dataset.counted = '1';

            const target = parseFloat(el.dataset.counter) || 0;
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            const finalText = formatNumber(target) + suffix;

            let finished = false;
            const finish = () => {
                if (finished) return;
                finished = true;
                el.textContent = finalText;
            };

            if (prefersReduced || typeof requestAnimationFrame !== 'function') {
                finish();
                return;
            }

            const start = performance.now();

            const step = (now) => {
                if (finished) return;
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = formatNumber(Math.round(target * eased)) + suffix;
                if (p < 1) requestAnimationFrame(step);
                else finish();
            };
            requestAnimationFrame(step);

            /* Rede de segurança: garante o valor final mesmo com rAF pausado */
            setTimeout(finish, duration + 400);
        };

        const counterObserver = 'IntersectionObserver' in window
            ? new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 })
            : null;

        /* Anima os contadores já visíveis e observa os que ainda não estão */
        function initCounters(scope = document) {
            scope.querySelectorAll('[data-counter]').forEach(el => {
                if (el.dataset.counted === '1') return;

                const rect = el.getBoundingClientRect();
                const inView = rect.bottom > 0 && rect.top < window.innerHeight * 0.95;

                if (inView) {
                    animateCounter(el);
                } else if (counterObserver) {
                    counterObserver.observe(el);
                } else {
                    el.textContent = formatNumber(el.dataset.counter) + (el.dataset.suffix || '');
                    el.dataset.counted = '1';
                }
            });
        }

        /* =========================================================
           6) Galeria + Lightbox
           ========================================================= */
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        const lightbox        = document.getElementById('lightbox');
        const lightboxImg     = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');
        const lightboxClose   = document.getElementById('lightboxClose');
        const lightboxPrev    = document.getElementById('lightboxPrev');
        const lightboxNext    = document.getElementById('lightboxNext');
        let currentIndex = 0;

        const isLightboxOpen = () => lightbox && lightbox.classList.contains('open');

        const openLightbox = (index) => {
            if (!lightbox || !galleryItems.length) return;
            currentIndex = (index + galleryItems.length) % galleryItems.length;

            const item = galleryItems[currentIndex];
            const img  = item.querySelector('img');

            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt || '';
            lightboxCaption.textContent = item.dataset.caption || img.alt || '';

            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
            lightboxClose.focus();
        };

        const closeLightbox = () => {
            if (!lightbox) return;
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        };

        const stepLightbox = (delta) => openLightbox(currentIndex + delta);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (lightbox) {
            lightboxClose.addEventListener('click', closeLightbox);
            lightboxPrev.addEventListener('click', () => stepLightbox(-1));
            lightboxNext.addEventListener('click', () => stepLightbox(1));

            /* Fecha ao clicar fora da imagem */
            lightbox.addEventListener('click', (event) => {
                if (event.target === lightbox) closeLightbox();
            });

            /* Gesto de arrastar (mobile) */
            let touchStartX = 0;
            lightbox.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
            }, { passive: true });
            lightbox.addEventListener('touchend', (e) => {
                const delta = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(delta) > 55) stepLightbox(delta > 0 ? -1 : 1);
            }, { passive: true });
        }

        /* =========================================================
           7) FAQ (acordeão)
           ========================================================= */
        const faqItems = Array.from(document.querySelectorAll('.faq-item'));

        const closeFaqItem = (item) => {
            item.classList.remove('open');
            const answer = item.querySelector('.faq-answer');
            const button = item.querySelector('.faq-question');
            if (answer) answer.style.maxHeight = null;
            if (button) button.setAttribute('aria-expanded', 'false');
        };

        faqItems.forEach(item => {
            const button = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!button || !answer) return;

            button.addEventListener('click', () => {
                const wasOpen = item.classList.contains('open');
                faqItems.forEach(closeFaqItem);

                if (!wasOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    button.setAttribute('aria-expanded', 'true');
                }
            });
        });

        /* Recalcula a altura do item de FAQ aberto ao redimensionar */
        window.addEventListener('resize', () => {
            const openItem = document.querySelector('.faq-item.open .faq-answer');
            if (openItem) openItem.style.maxHeight = openItem.scrollHeight + 'px';
        });

        /* =========================================================
           8) Teclado
           ========================================================= */
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
                closeLightbox();
                return;
            }
            if (!isLightboxOpen()) return;

            if (event.key === 'ArrowLeft')  stepLightbox(-1);
            if (event.key === 'ArrowRight') stepLightbox(1);
        });

        /* =========================================================
           9) Inicialização
           ========================================================= */
        const initFromHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && document.getElementById(hash)) {
                showTab(hash, { scroll: false });
            }
        };

        initFromHash();
        observeReveals();
        initCounters();
        onScroll();

        window.addEventListener('hashchange', initFromHash);
    });
})();
