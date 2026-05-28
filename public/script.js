const api = 'http://localhost:3000';

async function preencherTop5() {
    const top5List = document.getElementById('top5-list');

    const response = await fetch(api + '/restaurantes');
    const data = await response.json();

    const top5 = data.slice().sort((a, b) => {
            if (b.nota !== a.nota) return b.nota - a.nota;
            return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
        }).slice(0, 5);

    top5List.innerHTML = '';

    top5.forEach(restaurante => {
        const item = document.createElement('li');
        const imgHtml = restaurante.imagem
            ? `<img src="${restaurante.imagem}" alt="${restaurante.nome}" class="top5-img">`
            : `<div class="top5-img top5-img--placeholder"></div>`;

        item.innerHTML = `
            ${imgHtml}
            <div class="top5-info">
                <strong>${restaurante.nome}</strong>
                <span class="nota">${restaurante.nota.toFixed(1)}</span>
                <p>${restaurante.categoria} &nbsp;|&nbsp; ${restaurante.endereco}</p>
            </div>
        `;
        top5List.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', preencherTop5);
