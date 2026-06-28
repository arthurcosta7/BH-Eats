// Módulo de Favoritos - depende de login.js (usuarioCorrente) já carregado antes deste script
const FAVORITOS_API_URL = 'http://localhost:3000/usuarios';

function isFavorito(restauranteId) {
    return !!(usuarioCorrente.favoritos && usuarioCorrente.favoritos.includes(restauranteId));
}

function toggleFavorito(restauranteId, callback) {
    if (!usuarioCorrente.id) {
        window.location.href = 'login.html';
        return;
    }

    if (!usuarioCorrente.favoritos) usuarioCorrente.favoritos = [];

    const idx = usuarioCorrente.favoritos.indexOf(restauranteId);
    if (idx === -1) {
        usuarioCorrente.favoritos.push(restauranteId);
    } else {
        usuarioCorrente.favoritos.splice(idx, 1);
    }

    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));

    fetch(`${FAVORITOS_API_URL}/${usuarioCorrente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoritos: usuarioCorrente.favoritos }),
    })
        .then(response => response.json())
        .then(() => { if (callback) callback(); })
        .catch(error => console.error('Erro ao atualizar favoritos via API JSONServer:', error));
}

function renderFavoritoBtn(restauranteId) {
    const ativo = isFavorito(restauranteId) ? 'ativo' : '';
    const icone = isFavorito(restauranteId) ? '♥' : '♡';
    return `<button type="button" class="favorito-btn ${ativo}" title="Favoritar" onmousedown="event.preventDefault();" onclick="event.preventDefault(); event.stopPropagation(); handleFavoritoClick('${restauranteId}', this)">${icone}</button>`;
}

function handleFavoritoClick(restauranteId, btn) {
    toggleFavorito(restauranteId, function () {
        const ativo = isFavorito(restauranteId);
        btn.classList.toggle('ativo', ativo);
        btn.textContent = ativo ? '♥' : '♡';
    });
}
