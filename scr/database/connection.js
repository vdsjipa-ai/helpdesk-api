const mysql = require('mysql2');

// Configuração do pool de conexões com o MySQL para o HelpDesk
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Substitua pelo seu usuário do MySQL se for diferente
    password: 'root',      // Substitua pela sua senha do MySQL
    database: 'helpdesk_db',
    waitForConnections: true,
    connectionLimit: 10
});

// Exporta o pool utilizando o wrapper de Promises para podermos usar async/await nas rotas
module.exports = pool.promise();
