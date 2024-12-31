// Variáveis globais
let seriesData = [];
let currentFilter = null;
let displayedSeries = [];

// Função para embaralhar o array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Funções principais
async function loadSeries() {
    try {
        const response = await fetch("series.json");
        seriesData = await response.json();
        displayedSeries = shuffleArray(seriesData);
        displaySeries(displayedSeries);
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
    const isDetailsPage = document.body.classList.contains("detalhes");

    if (isDetailsPage) {
        window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
    } else {
        const filteredSeries = seriesData.filter((serie) =>
            serie.titulo.toLowerCase().includes(searchTerm)
        );
        displayedSeries = shuffleArray(filteredSeries);
        displaySeries(displayedSeries);
    }
}

function filterByEmoji(emoji, clickedButton) {
    // Remover classe active de todos os botões
    const filterButtons = document.querySelectorAll('.filter-emoji');
    filterButtons.forEach(button => button.classList.remove('active'));

    if (currentFilter === emoji) {
        // Se clicar no mesmo filtro, remove o filtro
        currentFilter = null;
        displayedSeries = shuffleArray(seriesData);
    } else {
        // Se clicar em um novo filtro, aplica o filtro e adiciona classe active
        currentFilter = emoji;
        clickedButton.classList.add('active');
        const filteredSeries = seriesData.filter(
            (serie) => serie.avaliacao === emoji
        );
        displayedSeries = shuffleArray(filteredSeries);
    }
    displaySeries(displayedSeries);
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

async function loadSerieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const serieId = urlParams.get("id");

    try {
        const response = await fetch("series.json");
        const data = await response.json();
        const serie = data.find((s) => s.id == serieId);

        if (serie) {
            document.title = serie.titulo;
            document.getElementById("serie-imagem").src = serie.imagem;
            document.getElementById("serie-imagem").alt = `Capa da série ${serie.titulo}`;
            document.getElementById("serie-sinopse").textContent = serie.sinopse;
            document.getElementById("serie-ano").textContent = serie.ano;
            document.getElementById("serie-avaliacao").textContent = `Avaliação: ${serie.avaliacao}`;
            document.getElementById("link-voltar").href = "/index.html";
            document.getElementById("link-sobre").href = "/sobre.html";
        } else {
            document.body.innerHTML = "<p>Série não encontrada.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar detalhes da série:", error);
    }
}

function initializeApp() {
    loadSeries().then(() => {
        const isDetailsPage = document.body.classList.contains("detalhes");

        if (isDetailsPage) {
            loadSerieDetails();
        } else {
            checkSearchParam();
        }

        // Configurar evento do botão aleatório
        const randomButton = document.getElementById("random-series");
        if (randomButton) {
            randomButton.addEventListener("click", randomSeries);
        }

        // Configurar eventos de busca
        const searchButton = document.getElementById("search-button");
        const searchInput = document.getElementById("search");

        if (searchButton && searchInput) {
            searchButton.addEventListener("click", searchSeries);
            searchInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") searchSeries();
            });
        }

        // Configurar eventos dos botões de filtro
        const filterButtons = document.querySelectorAll('.filter-emoji');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const emoji = button.getAttribute('data-filter');
                filterByEmoji(emoji, button);
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);