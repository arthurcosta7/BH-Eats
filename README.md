# BH Eats

Catálogo web de restaurantes de Belo Horizonte com autenticação de usuários, sistema de favoritos e cadastro de restaurantes. Desenvolvido como projeto da disciplina de Desenvolvimento de Interfaces Web (PUC Minas), consumindo uma API REST simulada com JSON Server.

## Funcionalidades

- **Home**: carrossel em destaque, restaurante em evidência (rotativo), grade de categorias e ranking Top 5 por nota
- **Categorias**: listagem filtrada de restaurantes por categoria (ex: Comida Mineira, Italiana, Japonesa)
- **Detalhes**: página individual com descrição, endereço, horário, telefone e link para o site do restaurante
- **Login e cadastro de usuários**: autenticação via sessionStorage com validação de campos e verificação de duplicidade de login/e-mail
- **Favoritos**: adição e remoção de restaurantes favoritos por usuário autenticado, persistidos via PATCH na API
- **Cadastro de restaurantes**: formulário para inserção de novos restaurantes na base de dados via POST

## Tecnologias

- HTML5, CSS3, JavaScript (vanilla)
- [JSON Server](https://github.com/typicode/json-server) como API REST simulada

## Como executar

```bash
npm install
npm start
```

- Site: http://localhost:3000
- API: http://localhost:3000/restaurantes

> Ao editar `db/db.json`, é necessário reiniciar o JSON Server.

## Estrutura do projeto

```
├── db/
│   └── db.json                   # base de dados simulada (restaurantes e usuários)
├── public/
│   ├── index.html                 # home
│   ├── categorias.html            # listagem por categoria
│   ├── restaurante.html           # detalhes do restaurante
│   ├── login.html                 # login de usuário
│   ├── cadastro.html              # cadastro de usuário
│   ├── favoritos.html             # página de favoritos
│   ├── cadastrarRestaurante.html  # cadastro de restaurante
│   ├── script.js
│   ├── categorias.js
│   ├── restaurante.js
│   ├── login.js
│   ├── favoritos.js
│   ├── paginaFavoritos.js
│   └── style.css
└── package.json
```
