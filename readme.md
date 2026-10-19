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