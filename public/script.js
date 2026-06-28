const api = 'http://localhost:3000';
let restaurantesData = [];

function comImagem(restaurantes) {
    return restaurantes.filter(r => r.imagem && !r.imagem.endsWith('.html'));
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function normalizarTexto(texto = '') {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function filtrarRestaurantes(restaurantes, termo) {
    const texto = normalizarTexto(termo);
    if (!texto) return restaurantes;

    return restaurantes.filter(restaurante => {
        const nome = normalizarTexto(restaurante.nome || '');
        const descricao = normalizarTexto(restaurante.descricao || '');
        return nome.includes(texto) || descricao.includes(texto);
    });
}

async function carregarPagina() {
    try {
        const response = await fetch(api + '/restaurantes');
        const restaurantes = await response.json();
        restaurantesData = restaurantes;
        iniciarCarrossel(restaurantes);
        preencherDestaque(restaurantes);
        preencherCategorias(restaurantes);
        preencherTop5(restaurantes);
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
    }
}

function iniciarCarrossel(restaurantes) {
    const container = document.getElementById('hero-carousel');
    const lista = comImagem(restaurantes);
    if (!lista.length || !container) return;

    let atual = 0;

    container.innerHTML = `
        <div class="carousel-inner">
            ${lista.map((r, i) => `
                <div class="carousel-slide${i === 0 ? ' active' : ''}">
                    <img src="${r.imagem}" alt="${r.nome}" class="hero-image">
                    <div class="carousel-caption">${r.nome}</div>
                </div>
            `).join('')}
        </div>
        <button class="carousel-btn carousel-prev" id="carousel-prev">&#10094;</button>
        <button class="carousel-btn carousel-next" id="carousel-next">&#10095;</button>
        <div class="carousel-dots">
            ${lista.map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}"></span>`).join('')}
        </div>
    `;

    const slides = container.querySelectorAll('.carousel-slide');
    const dots = container.querySelectorAll('.dot');

    function goTo(idx) {
        slides[atual].classList.remove('active');
        dots[atual].classList.remove('active');
        atual = (idx + lista.length) % lista.length;
        slides[atual].classList.add('active');
        dots[atual].classList.add('active');
    }

    container.querySelector('#carousel-prev').addEventListener('click', () => goTo(atual - 1));
    container.querySelector('#carousel-next').addEventListener('click', () => goTo(atual + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    setInterval(() => goTo(atual + 1), 4000);
}

function preencherDestaque(restaurantes) {
    const lista = comImagem(restaurantes);
    const r = pickRandom(lista);
    if (!r) return;

    const img = document.querySelector('.destaque-image');
    const titulo = document.querySelector('.destaque-text h2');
    const texto = document.querySelector('.destaque-text p');

    if (img) { img.src = r.imagem; img.alt = r.nome; }
    if (titulo) titulo.textContent = r.nome;
    if (texto) texto.textContent = r.descricao;
}

function preencherCategorias(restaurantes) {
    const grid = document.querySelector('.categorias-grid');
    if (!grid) return;

    const categorias = [...new Set(restaurantes.map(r => r.categoria))].sort();

    grid.innerHTML = categorias.map(cat => {
        const qtd = restaurantes.filter(r => r.categoria === cat).length;
        return `
            <a class="categoria-item" href="categorias.html?categoria=${encodeURIComponent(cat)}">
                <h3>${cat}</h3>
                <p>${qtd} restaurante${qtd !== 1 ? 's' : ''}</p>
            </a>
        `;
    }).join('');
}

function preencherTop5(restaurantes) {
    const top5List = document.getElementById('top5-list');
    if (!top5List) return;

    const top5 = restaurantes.slice()
        .sort((a, b) => b.nota !== a.nota ? b.nota - a.nota : a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
        .slice(0, 5);

    top5List.innerHTML = top5.map(r => {
        const imgHtml = r.imagem && !r.imagem.endsWith('.html')
            ? `<img src="${r.imagem}" alt="${r.nome}" class="top5-img">`
            : `<div class="top5-img top5-img--placeholder"></div>`;
        return `
            <li>
                ${imgHtml}
                <div class="top5-info">
                    <strong>${r.nome}</strong>
                    <span class="nota">${r.nota.toFixed(1)}</span>
                    <p>${r.categoria} &nbsp;|&nbsp; ${r.endereco}</p>
                </div>
                ${renderFavoritoBtn(r.id)}
            </li>
        `;
    }).join('');
}

function renderizarResultadosBusca(restaurantes, termo = '') {
    const container = document.getElementById('resultado-busca');
    if (!container) return;

    const filtrados = filtrarRestaurantes(restaurantes, termo);
    if (!filtrados.length) {
        container.innerHTML = '<p class="busca-vazia">Nenhum restaurante encontrado.</p>';
        return;
    }

    container.innerHTML = `
        <h3>Resultados da busca</h3>
        <ul class="restaurantes-lista">
            ${filtrados.map(r => `
                <li class="restaurante-card-wrapper">
                    <a class="restaurante-card" href="restaurante.html?id=${r.id}">
                        <img src="${r.imagem || 'assets/images/placeholder.png'}" alt="${r.nome}" class="restaurante-card-img ${r.imagem ? '' : 'restaurante-card-img--placeholder'}">
                        <div class="restaurante-card-info">
                            <strong>${r.nome}</strong>
                            <p>${r.categoria}</p>
                            <span class="nota">${r.nota.toFixed(1)}</span>
                            <p>${r.descricao}</p>
                        </div>
                    </a>
                    ${renderFavoritoBtn(r.id)}
                </li>
            `).join('')}
        </ul>
    `;
}

function inicializarBusca() {
    const input = document.getElementById('busca-restaurantes');
    const container = document.getElementById('resultado-busca');
    if (!input || !container) return;

    container.innerHTML = '';

    input.addEventListener('input', () => {
        const termo = input.value.trim();
        if (!termo) {
            container.innerHTML = '';
            return;
        }

        const filtrados = filtrarRestaurantes(restaurantesData, termo);
        renderizarResultadosBusca(filtrados, termo);
    });
}

function atualizarBotaoCadastrarRestaurante() {
    const item = document.getElementById('cadastrar-restaurante-button');
    if (!item) return;

    if (typeof usuarioCorrente !== 'undefined' && usuarioCorrente.tipo === 'admin') {
        item.style.display = '';
    }
}

function atualizarBotaoLogin() {
    const item = document.getElementById('login-button-item');
    const link = document.querySelector('#login-button-item a');
    if (!item || !link) return;

    const estaLogado = !!sessionStorage.getItem('usuarioCorrente');

    if (estaLogado) {
        item.style.display = 'none';
    } else {
        item.style.display = '';
        link.textContent = 'Login';
        link.href = 'login.html';
        link.style.cursor = 'pointer';
        link.onclick = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarPagina();
    atualizarBotaoLogin();
    atualizarBotaoCadastrarRestaurante();
    inicializarBusca();
});
