const rotasSolicitantes = require('./routes/solicitantes.routes');
const express = require('express'); 
const rotasHelpDesk = require('./routes/chamados.routes'); // Carrega as rotas que criamos

const app = express();
const PORT = 3000;

// Permite receber dados em formato JSON no req.body
app.use(express.json());

// Ativa as rotas no servidor Express
app.use(rotasHelpDesk); 
app.use(rotasSolicitantes);

app.get('/', (req, res) => {
    res.json({ message: 'API HelpDesk rodando perfeitamente!' });
});

app.listen(PORT, () => {
    console.log(`🚀 API HelpDesk rodando perfeitamente na porta ${PORT}!`);
});
