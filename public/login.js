// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza o registro de novos usuários e login para aplicações com 
// backend baseado em API REST provida pelo JSONServer
// Os dados de usuário estão localizados no arquivo db.json que acompanha este projeto.
//
// Autor: Rommel Vieira Carneiro (rommelcarneiro@gmail.com)
// Data: 09/09/2024
//
// Código LoginApp  


// Página inicial de Login
const LOGIN_URL = "login.html";
const CADASTRO_URL = "cadastro.html";
let RETURN_URL = "index.html";
const API_URL = 'http://localhost:3000/usuarios';

// Objeto para o banco de dados de usuários baseado em JSON
var db_usuarios = [];

// Objeto para o usuário corrente
var usuarioCorrente = {};

// Inicializa a aplicação de Login
function initLoginApp () {
    let pagina = window.location.pathname;
    let estaNaPaginaDeLogin = pagina.endsWith('/' + LOGIN_URL) || pagina === LOGIN_URL;
    let estaNaPaginaDeCadastro = pagina.endsWith('/' + CADASTRO_URL) || pagina === CADASTRO_URL;
    if (!estaNaPaginaDeLogin) {
        // CONFIGURA A URL DE RETORNO COMO A PÁGINA ATUAL, EXCETO SE FOR A PRÓPRIA PÁGINA DE CADASTRO
        if (!estaNaPaginaDeCadastro) {
            sessionStorage.setItem('returnURL', pagina);
            RETURN_URL = pagina;
        }

        // INICIALIZA USUARIOCORRENTE A PARTIR DE DADOS NO LOCAL STORAGE, CASO EXISTA
        usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        if (usuarioCorrenteJSON) {
            usuarioCorrente = JSON.parse (usuarioCorrenteJSON);
        }

        // REGISTRA LISTENER PARA O EVENTO DE CARREGAMENTO DA PÁGINA PARA ATUALIZAR INFORMAÇÕES DO USUÁRIO
        document.addEventListener('DOMContentLoaded', function () {
            showUserInfo ('userInfo');
        });
    }
    else {
        // VERIFICA SE A URL DE RETORNO ESTÁ DEFINIDA NO SESSION STORAGE, CASO CONTRARIO USA A PÁGINA INICIAL
        let returnURL = sessionStorage.getItem('returnURL');

        // IGNORA URL DE RETORNO ARMAZENADA (POSSIVELMENTE ANTIGA) QUE APONTE PARA LOGIN OU CADASTRO
        let returnURLInvalida = returnURL && (
            returnURL.endsWith('/' + LOGIN_URL) || returnURL === LOGIN_URL ||
            returnURL.endsWith('/' + CADASTRO_URL) || returnURL === CADASTRO_URL
        );

        if (returnURL && !returnURLInvalida) {
            RETURN_URL = returnURL;
        }
    }

    // INICIALIZA BANCO DE DADOS DE USUÁRIOS
    carregarUsuarios(() => {
        console.log('Usuários carregados...');
    });
};


function carregarUsuarios(callback) {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        db_usuarios = data;
        callback ()
    })
    .catch(error => {
        console.error('Erro ao ler usuários via API JSONServer:', error);
        displayMessage("Erro ao ler usuários");
    });
}

// Verifica se o login do usuário está ok e, se positivo, direciona para a página inicial
function loginUser (login, senha) {

    // Verifica todos os itens do banco de dados de usuarios 
    // para localizar o usuário informado no formulario de login
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];

        // Se encontrou login, carrega usuário corrente e salva no Session Storage
        if (login == usuario.login && senha == usuario.senha) {
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.login;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.nome = usuario.nome;
            usuarioCorrente.tipo = usuario.tipo;
            usuarioCorrente.favoritos = usuario.favoritos || [];

            // Salva os dados do usuário corrente no Session Storage, mas antes converte para string
            sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));

            // Retorna true para usuário encontrado
            return true;
        }
    }

    // Se chegou até aqui é por que não encontrou o usuário e retorna falso
    return false;
}

// Apaga os dados do usuário corrente no sessionStorage
function logoutUser () {
    sessionStorage.removeItem ('usuarioCorrente');
    window.location = LOGIN_URL;
}

// Verifica se já existe um usuário cadastrado com o mesmo login ou email
function usuarioExiste (login, email) {
    return db_usuarios.some(usuario => usuario.login === login || usuario.email === email);
}

function addUser (nome, login, senha, email) {

    // Cria um objeto de usuario para o novo usuario 
    let usuario = { "login": login, "senha": senha, "nome": nome, "email": email, "tipo": "user" };

    // Envia dados do novo usuário para ser inserido no JSON Server
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
        .then(response => response.json())
        .then(data => {
            // Adiciona o novo usuário na variável db_usuarios em memória
            db_usuarios.push (usuario);
            displayMessage("Usuário inserido com sucesso");
        })
        .catch(error => {
            console.error('Erro ao inserir usuário via API JSONServer:', error);
            displayMessage("Erro ao inserir usuário");
        });
}

// Exibe uma mensagem para o usuário na página atual
function displayMessage (msg) {
    const ids = ['login-message', 'cadastro-restaurante-message'];
    const elemMsg = ids.map(id => document.getElementById(id)).find(Boolean);

    if (elemMsg) {
        elemMsg.textContent = msg;
    } else {
        console.log(msg);
    }
}

function showUserInfo (element) {
    var elemUser = document.getElementById(element);
    if (!elemUser) return;

    const possuiUsuario = !!(usuarioCorrente && usuarioCorrente.nome);
    elemUser.style.display = possuiUsuario ? '' : 'none';

    const favoritosLink = document.getElementById('favoritos-link');
    if (favoritosLink) {
        favoritosLink.style.display = possuiUsuario ? '' : 'none';
    }

    if (possuiUsuario) {
        elemUser.innerHTML = `${usuarioCorrente.nome} (${usuarioCorrente.login}) 
                    <a href="#" onclick="event.preventDefault(); logoutUser();">❌</a>`;
    } else {
        elemUser.innerHTML = '';
    }
}

// Inicializa as estruturas utilizadas pelo LoginApp
initLoginApp ();

document.addEventListener('DOMContentLoaded', function () {
    // Registra o evento de submit do formulário de login
    let formLogin = document.getElementById('login-form');
    if (!formLogin) return;
    formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        let login = document.getElementById('login').value;
        let senha = document.getElementById('senha').value;
        if (!login || !senha) {
            displayMessage("Por favor, preencha todos os campos.");
            return;
        }
        if (loginUser(login, senha)) {
            window.location.href = RETURN_URL;
        } else {
            displayMessage("Login ou senha inválidos.");
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Registra o evento de submit do formulário de cadastro
    let formCadastro = document.getElementById('cadastro-form');
    if (!formCadastro) return;
    formCadastro.addEventListener('submit', function (e) {
        e.preventDefault();
        let nome = document.getElementById('nome').value;
        let login = document.getElementById('login').value;
        let email = document.getElementById('email').value;
        let senha = document.getElementById('senha').value;
        if (!nome || !login || !senha || !email) {
            console.log("Por favor, preencha todos os campos.");
            return;
        }
        if (usuarioExiste(login, email)) {
            displayMessage("Já existe um usuário cadastrado com esse login ou email.");
            return;
        }
        addUser(nome, login, senha, email);
        formCadastro.reset();
        window.location.href = LOGIN_URL;
    });
});
