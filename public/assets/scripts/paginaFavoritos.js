const api = 'http://localhost:3000';

async function carregarFavoritos() {
    const lista = document.getElementById('favoritos-lista');
    if (!lista) return;

    if (!usuarioCorrente.id) {
        lista.innerHTML = '<p>Você precisa <a href="login.html">fazer login</a> para ver seus favoritos.</p>';
        return;
    }

    try {
        const response = await fetch(api + '/restaurantes');
        const restaurantes = await response.json();
        const favoritos = restaurantes.filter(r => isFavorito(r.id));

        if (!favoritos.length) {
            lista.innerHTML = '<p>Você ainda não tem restaurantes favoritos.</p>';
            return;
        }

        lista.innerHTML = favoritos.map(r => {
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
        console.error('Erro ao carregar favoritos:', err);
        lista.innerHTML = '<p>Erro ao carregar favoritos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', carregarFavoritos);
