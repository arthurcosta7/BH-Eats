const api = 'http://localhost:3000';

async function carregarCategoria() {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get('categoria');

    if (!categoria) {
        window.location.href = 'index.html#categorias';
        return;
    }

    document.title = `${categoria} - Restaurantes BH`;
    document.getElementById('categoria-titulo').textContent = categoria;

    try {
        const response = await fetch(api + '/restaurantes');
        const restaurantes = await response.json();
        const filtrados = restaurantes.filter(r => r.categoria === categoria);
        const lista = document.getElementById('restaurantes-lista');

        if (!filtrados.length) {
            lista.innerHTML = '<p>Nenhum restaurante encontrado nesta categoria.</p>';
            return;
        }

        lista.innerHTML = filtrados.map(r => {
            const imgHtml = r.imagem && !r.imagem.endsWith('.html')
                ? `<img src="${r.imagem}" alt="${r.nome}" class="restaurante-card-img">`
                : `<div class="restaurante-card-img restaurante-card-img--placeholder"></div>`;
            return `
                <li>
                    <a class="restaurante-card" href="restaurante.html?id=${r.id}">
                        ${imgHtml}
                        ${renderFavoritoBtn(r.id)}
                        <div class="restaurante-card-info">
                            <strong>${r.nome}</strong>
                            <span class="nota">${r.nota.toFixed(1)}</span>
                            <p>${r.endereco}</p>
                            <p class="restaurante-horario">${r.horario}</p>
                        </div>
                    </a>
                </li>
            `;
        }).join('');
    } catch (err) {
        console.error('Erro ao carregar restaurantes:', err);
    }
}

document.addEventListener('DOMContentLoaded', carregarCategoria);
