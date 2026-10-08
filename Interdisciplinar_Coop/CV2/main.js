// Lógica para o simulador de valores baseado no PDF
const inputVisitantes = document.getElementById('visitantes');
const displayTotal = document.getElementById('displayTotal');

// Valor base do Day Use conforme PDF (R$ 30,00) 
const VALOR_BASE = 30;

function atualizarTotal() {
    const qtd = parseInt(inputVisitantes.value) || 0;
    const calculo = qtd * VALOR_BASE;
    
    // Atualiza o texto na tela
    displayTotal.innerText = `Total: R$ ${calculo.toFixed(2).replace('.', ',')}`;
}

// Escuta mudanças no input
inputVisitantes.addEventListener('input', atualizarTotal);

// Inicializa o valor
atualizarTotal();