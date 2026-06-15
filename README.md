# BH Eats

Catálogo web de restaurantes de Belo Horizonte, com listagem por categoria, página de detalhes e ranking dos melhores avaliados. Desenvolvido como projeto da disciplina de Desenvolvimento de Interfaces Web (PUC Minas), consumindo uma API REST simulada com JSON Server.

## Funcionalidades

- **Home**: carrossel em destaque, restaurante em evidência (rotativo), grade de categorias e ranking Top 5 por nota
- **Categorias**: listagem filtrada de restaurantes por categoria (ex: Comida Mineira, Italiana, Japonesa)
- **Detalhes**: página individual com descrição, endereço, horário, telefone e link para o site do restaurante
- Consumo de API REST via `fetch`/`async-await`, sem frameworks

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
│   └── db.json          # base de dados simulada (restaurantes)
├── public/
│   ├── index.html        # home
│   ├── categorias.html    # listagem por categoria
│   ├── restaurante.html   # detalhes do restaurante
│   ├── script.js
│   ├── categorias.js
│   ├── restaurante.js
│   └── style.css
└── package.json
```
