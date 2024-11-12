require('dotenv').config({ path: './.env' });
const mysql = require('mysql2');

let conexao;

function handleDisconnect() {
    conexao = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10, 
        queueLimit: 0,
        connectTimeout: 100000,
    });

    conexao.getConnection((err, connection) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] Erro ao conectar ao MySQL:`, err);
            setTimeout(handleDisconnect, 2000); // Continua tentando reconectar
        } else {
            connection.release(); // Libera a conexão de volta ao pool
        }
    });
}

handleDisconnect();

module.exports = conexao;
