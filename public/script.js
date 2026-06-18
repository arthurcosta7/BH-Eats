const api = 'http://localhost:3000';

function comImagem(restaurantes) {
    return restaurantes.filter(r => r.imagem && !r.imagem.endsWith('.html'));
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function carregarPagina() {
    try {
        const response = await fetch(api + '/restaurantes');
        const restaurantes = await response.json();
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

function atualizarBotaoCadastrarRestaurante() {
    const item = document.getElementById('cadastrar-restaurante-button');
    if (!item) return;

    if (typeof usuarioCorrente !== 'undefined' && usuarioCorrente.tipo === 'admin') {
        item.style.display = '';
    }
}

function atualizarBotaoLogin() {
    const link = document.querySelector('#login-button a');
    if (!link) return;

    if (sessionStorage.getItem('usuarioCorrente')) {
        link.textContent = 'Logout';
        link.removeAttribute('href');
        link.style.cursor = 'pointer';
        link.addEventListener('click', function (e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

document.addEventListener('DOMContentLoaded', carregarPagina);
document.addEventListener('DOMContentLoaded', atualizarBotaoLogin);
document.addEventListener('DOMContentLoaded', atualizarBotaoCadastrarRestaurante);
