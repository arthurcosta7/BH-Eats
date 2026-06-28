const api = 'http://localhost:3000';

let restaurantes = [];

async function carregarRestaurante() {
    if (!document.getElementById('restaurante-detalhe')) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(api + '/restaurantes/' + id);
        if (!response.ok) throw new Error('Restaurante não encontrado');
        const r = await response.json();

        document.title = `${r.nome} - Restaurantes BH`;

        const imgHtml = r.imagem && !r.imagem.endsWith('.html')
            ? `<img src="${r.imagem}" alt="${r.nome}" class="restaurante-detalhe-img">`
            : '';

        const telefoneHtml = r.telefone
            ? `<li><strong>Telefone:</strong> <a href="tel:${r.telefone}">${r.telefone}</a></li>`
            : '';

        const siteHtml = r.site
            ? `<li><strong>Site:</strong> <a href="${r.site}" target="_blank" rel="noopener noreferrer">${r.site}</a></li>`
            : '';

        document.getElementById('restaurante-detalhe').innerHTML = `
            <a href="categorias.html?categoria=${encodeURIComponent(r.categoria)}" class="voltar-link">← Voltar para ${r.categoria}</a>
            <div class="restaurante-detalhe-content">
                ${imgHtml}
                <div class="restaurante-detalhe-info">
                    <div class="restaurante-detalhe-header">
                        <h1>${r.nome}</h1>
                        ${renderFavoritoBtn(r.id)}
                    </div>
                    <span class="nota nota-grande">${r.nota.toFixed(1)}</span>
                    <p class="categoria-badge">${r.categoria}</p>
                    <p class="restaurante-descricao">${r.descricao}</p>
                    <ul class="detalhes-lista">
                        <li><strong>Endereço:</strong> ${r.endereco}</li>
                        ${telefoneHtml}
                        <li><strong>Horário:</strong> ${r.horario}</li>
                        ${siteHtml}
                    </ul>
                </div>
            </div>
        `;
    } catch (err) {
        document.getElementById('restaurante-detalhe').innerHTML =
            `<p>Erro ao carregar restaurante. <a href="index.html">Voltar ao início</a></p>`;
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', carregarRestaurante);
