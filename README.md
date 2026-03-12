# Biblioteca API

Projeto criado com a finalidade de aprender mais sobre o NestJS por meio da construção de uma API de gerenciamento de biblioteca. A aplicação cobre autenticação, cadastro de livros e leitores, controle de exemplares e fluxo de empréstimos e devoluções.

## Tecnologias usadas

- NestJS
- Docker
- PostgreSQL
- Redis
- TypeORM
- JWT
- Swagger/Scalar para documentação da API

## Visão geral

A API expõe recursos para:

- autenticação com access token e refresh token
- gerenciamento de livros
- gerenciamento de exemplares de cada livro
- gerenciamento de leitores
- controle de empréstimos, devoluções e cancelamentos

Documentação interativa da API: `/docs`

## Endpoints

### Públicos

- `GET /`: retorna uma mensagem simples de disponibilidade da aplicação
- `POST /auth/login`: autentica um usuário com email e senha

### Autenticação

- `POST /auth/refresh`: gera um novo par de tokens usando o refresh token enviado no header `Authorization`
- `POST /auth/logout`: invalida o refresh token atual

### Livros

- `POST /books`: cria um livro
- `GET /books`: lista livros com paginação
- `GET /books/:id`: busca um livro por id
- `GET /books/isbn/:isbn`: busca um livro por ISBN
- `PATCH /books/:id`: atualiza um livro
- `DELETE /books/:id`: remove logicamente um livro

### Exemplares

- `POST /books/:bookId/copies`: cria uma quantidade de exemplares para um livro
- `GET /books/:bookId/copies`: lista os exemplares de um livro, com suporte a paginação e filtro por status
- `GET /books/:bookId/copies/:id`: busca um exemplar específico de um livro
- `PATCH /books/:bookId/copies/:id`: atualiza um exemplar
- `DELETE /books/:bookId/copies/:id`: remove logicamente um exemplar

### Leitores

- `POST /readers`: cria um leitor
- `GET /readers`: lista leitores com paginação e filtro por status
- `GET /readers/:id`: busca um leitor por id
- `PATCH /readers/:id`: atualiza um leitor
- `DELETE /readers/:id`: remove logicamente um leitor

### Empréstimos

- `POST /loans/borrow`: realiza o empréstimo de um exemplar para um leitor
- `POST /loans/:id/return`: registra a devolução de um empréstimo
- `GET /loans`: lista empréstimos com paginação
- `GET /loans/:id`: busca um empréstimo por id
- `DELETE /loans/:id/cancel`: cancela um empréstimo ativo

## Regras de negócio

- Todas as rotas são protegidas por autenticação, exceto `GET /` e `POST /auth/login`.
- A autenticação usa JWT com access token e refresh token.
- Os refresh tokens são armazenados no Redis e invalidados em operações de refresh e logout.
- Um usuário administrador inicial é criado automaticamente ao iniciar a aplicação, desde que `ADMIN_EMAIL` e `ADMIN_PASSWORD` estejam definidos nas variáveis de ambiente.
- O empréstimo só pode ser realizado se o exemplar estiver com status `available`.
- Cada empréstimo tem duração padrão de 14 dias.
- Um leitor pode ter no máximo 5 empréstimos ativos ao mesmo tempo.
- Um leitor com empréstimo em atraso não pode realizar novos empréstimos.
- Ao devolver um livro após ultrapassar a data de vencimento em mais de 7 dias de tolerância, o leitor é suspenso automaticamente.
- A remoção de livros, exemplares, leitores e empréstimos cancelados é lógica, usando marcação de exclusão em vez de exclusão física.
- Ao emprestar um exemplar, seu status muda para `borrowed`.
- Ao devolver ou cancelar um empréstimo ativo, o exemplar volta para `available`.
- A reversão de suspensão do leitor é manual.

## Considerações

- Esta aplicação usa o fuso horário do computador para operações essenciais, como aplicação de suspensões e validação de empréstimos.
