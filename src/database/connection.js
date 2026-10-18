const mysql = require('mysql2');

// Configura os dados do seu MySQL local criado no DBeaver
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Padrão do XAMPP (sem senha)
    database: 'helpdesk_db' // Nome do banco que criamos no DBeaver
});

// Executa a conexão e exibe o status no terminal
conexao.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro.message);
    } else {
        console.log('🔗 Conexão com o banco de dados MySQL realizada com sucesso!');
    }
});

// Exporta a conexão para podermos usar nas rotas
module.exports = conexao;

