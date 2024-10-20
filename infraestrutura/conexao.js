require('dotenv').config();
console.log(process.env.DB_HOST, process.env.DB_USER)
const mysql = require('mysql2');

let conexao;

function handleDisconnect() {
    conexao = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        keepAliveInitialDelay: 10000,
        enableKeepAlive: true
    });

    conexao.connect(err => {
        if (err) {
            console.error(`[${new Date().toISOString()}] Erro ao conectar ao MySQL:`, err);
            setTimeout(handleDisconnect, 2000); // Continua tentando reconectar a cada 2 segundos
        } else {
            console.log(`[${new Date().toISOString()}] Conectado ao MySQL`);
        }
    });

    conexao.on('error', err => {
        console.error(`[${new Date().toISOString()}] Erro na conexão MySQL:`, err);

        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            console.log('Tentando reconectar após erro de perda de conexão...');
            handleDisconnect(); // Reconectar automaticamente em caso de perda de conexão
        } else {
            throw err; // Lida com outros tipos de erro
        }
    });
}

handleDisconnect();

module.exports = conexao;
