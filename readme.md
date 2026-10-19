# HelpDesk API

API REST para gestão de chamados de suporte, desenvolvida como Projeto Integrador do curso Desenvolvedor Back-End (Bolsa Futuro Digital).

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2/promise
- dotenv

## Como executar

1. Clone o repositório e instale as dependências:
```
   npm install
```
2. Copie o arquivo `.env.example` para `.env` e ajuste os dados de conexão com o banco.
3. Execute o script `database/helpdesk.sql` no MySQL para criar o banco e as tabelas.
4. Inicie o servidor:
```
   npm run dev
```
5. A API ficará disponível em `http://localhost:3000`.

## Endpoints

### Categorias e técnicos
- GET /categorias
- GET /tecnicos

### Solicitantes
- GET /solicitantes
- GET /solicitantes/:id
- POST /solicitantes
- PUT /solicitantes/:id
- DELETE /solicitantes/:id

### Chamados
- POST /chamados
- GET /chamados (filtros: ?status=ABERTO, ?prioridade=ALTA)
- GET /chamados/:id
- PUT /chamados/:id
- DELETE /chamados/:id

### Relatórios
- GET /relatorios/chamados-por-status