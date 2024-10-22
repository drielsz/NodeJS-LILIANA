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
        keepAliveInitialDelay: 10000,
        enableKeepAlive: true,
        waitForConnections: true,
        connectTimeout: 60000, // Timeout de 60 segundos
        acquireTimeout: 60000, // Tempo limite para adquirir uma conexão
        queueLimit: 0
    });

    conexao.getConnection((err, connection) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] Erro ao conectar ao MySQL:`, err);
            setTimeout(handleDisconnect, 2000); // Continua tentando reconectar a cada 2 segundos
        } else {
            console.log(`[${new Date().toISOString()}] Conectado ao MySQL`);
            if (connection) connection.release(); // Libera a conexão de volta ao pool
        }
    });

    conexao.on('error', err => {
        console.error(`[${new Date().toISOString()}] Erro na conexão MySQL:`, err);
    
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
            console.log('Tentando reconectar após erro de perda de conexão...');
            handleDisconnect(); // Reconectar automaticamente em caso de perda de conexão
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = conexao.promise();
