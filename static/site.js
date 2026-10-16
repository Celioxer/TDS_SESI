// Função para carregar componentes HTML repetitivos
async function loadFragment(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Fragmento não encontrado');
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
    } catch (error) {
        console.error(`Erro ao carregar fragmento de ${filePath}:`, error);
    }
}

// Configurar animações de entrada (Fade-in ao rolar a página)
function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: parar de observar após aparecer a primeira vez
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // O elemento aparece quando 10% dele estiver na tela
    });

    const hiddenElements = document.querySelectorAll('.fade-in');
    hiddenElements.forEach((el, index) => {
        // Adiciona um pequeno delay baseado na ordem para um efeito de "cascata"
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Inicializar a página
window.onload = async () => {
    // Aguarda o carregamento dos fragmentos
    await loadFragment('header-placeholder', 'fragments/header.html');
    await loadFragment('footer-placeholder', 'fragments/footer.html');
    
    // Inicia as animações após tudo estar na tela
    setupAnimations();
};