const api = 'http://localhost:3000';

function addRestaurante(nome, categoria, endereco, telefone, horario, descricao, nota, site, imagem) {
    const restaurante = {
        nome,
        categoria,
        endereco,
        telefone,
        horario,
        descricao,
        nota,
        site,
        imagem,
    };

    fetch(api + '/restaurantes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurante),
    })
        .then(response => response.json())
        .then(() => {
            displayMessage('Restaurante inserido com sucesso');
            document.getElementById('restaurant-form').reset();
        })
        .catch(error => {
            console.error('Erro ao inserir restaurante via API JSONServer:', error);
            displayMessage('Erro ao inserir restaurante');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('restaurant-form');
    if (!form) return;

    const usuarioSalvo = sessionStorage.getItem('usuarioCorrente');
    const usuarioCorrenteLogado = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

    if (!usuarioCorrenteLogado || usuarioCorrenteLogado.tipo !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const categoria = document.getElementById('categoria').value;
        const endereco = document.getElementById('endereco').value;
        const telefone = document.getElementById('telefone').value;
        const horario = document.getElementById('horario').value;
        const descricao = document.getElementById('descricao').value;
        const nota = parseFloat(document.getElementById('nota').value);
        const site = document.getElementById('site').value;
        const imagem = document.getElementById('imagem').value;

        if (!nome || !categoria || !endereco || Number.isNaN(nota)) {
            displayMessage('Por favor, preencha os campos obrigatórios (nome, categoria, endereço, nota).');
            return;
        }

        addRestaurante(nome, categoria, endereco, telefone, horario, descricao, nota, site, imagem);
    });
});
