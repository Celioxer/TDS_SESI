// Função para carregar componentes HTML repetitivos
async function loadFragment(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
    } catch (error) {
        console.error("Erro ao carregar fragmento:", error);
    }
}

// Carregar header e footer ao iniciar a página
window.onload = () => {
    loadFragment('header-placeholder', 'fragments/header.html');
    loadFragment('footer-placeholder', 'fragments/footer.html');
};