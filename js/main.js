// Variáveis globais
let seriesData = [];
let currentFilter = null;

// Funções principais
async function loadSeries() {
    try {
        const response = await fetch("series.json");
        seriesData = await response.json();
        displaySeries(seriesData);
    } catch (error) {
        console.error("Erro ao carregar séries:", error);
    }
}

function displaySeries(series) {
    const grid = document.getElementById("series-grid");
    grid.innerHTML = "";
    series.forEach((serie) => {
        const serieElement = `
            <a href="serie.html?id=${serie.id}">
                <img src="${serie.imagem}" alt="Capa da série ${serie.titulo}">
                <h2>${serie.titulo}${serie.avaliacao}</h2>
            </a>
        `;
        grid.innerHTML += serieElement;
    });
}

function searchSeries() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filteredSeries = seriesData.filter((serie) =>
        serie.titulo.toLowerCase().includes(searchTerm)
    );
    displaySeries(filteredSeries);
}

function filterByAvaliacao(avaliacao) {
    if (currentFilter === avaliacao) {
        currentFilter = null;
        displaySeries(seriesData);
    } else {
        currentFilter = avaliacao;
        const filteredSeries = seriesData.filter(
            (serie) => serie.avaliacao === avaliacao
        );
        displaySeries(filteredSeries);
    }
}

function randomSeries() {
    if (seriesData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * seriesData.length);
    const randomSerie = seriesData[randomIndex];
    window.location.href = `serie.html?id=${randomSerie.id}`;
}

function checkSearchParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
        document.getElementById("search").value = searchTerm;
        searchSeries();
    }
}

// Inicialização e Event Listeners
function initializeApp() {
    // Botões e eventos de clique
    document.getElementById("random-series").addEventListener("click", randomSeries);
    document.getElementById("search-button").addEventListener("click", searchSeries);

    // No evento de clique dos filtros, adicione:
document.querySelectorAll(".filter-emoji").forEach((button) => {
    button.addEventListener("click", function () {
        const avaliacao = button.getAttribute("data-filter");
        
        // Remove a classe active de todos os botões
        document.querySelectorAll(".filter-emoji").forEach(btn => {
            btn.classList.remove("active");
        });
        
        // Adiciona a classe active apenas se não for desativar o filtro
        if (currentFilter !== avaliacao) {
            button.classList.add("active");
        }
        
        filterByAvaliacao(avaliacao);
    });
});

    // Busca com Enter
    document.getElementById("search").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            searchSeries();
        }
    });

    // Carrega as séries e verifica parâmetros de busca
    loadSeries().then(() => {
        checkSearchParam();
    });
}



// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeApp);