const express = require('express');
const app = express();

// Middleware para ler JSON no corpo das requisições (POST/PUT)
app.use(express.json());

// Importa e vincula as rotas de chamados
const chamadosRoutes = require('./routes/chamados.routes');
app.use(chamadosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API HelpDesk rodando perfeitamente na porta ${PORT}!`);
});
