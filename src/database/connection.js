require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Testa a conexão ao iniciar e mostra o status no terminal
pool.getConnection()
    .then((conn) => {
        console.log('🔗 Conexão com o banco de dados MySQL realizada com sucesso!');
        conn.release();
    })
    .catch((erro) => {
        console.error('Erro ao conectar ao banco de dados:', erro.message);
    });

module.exports = pool;