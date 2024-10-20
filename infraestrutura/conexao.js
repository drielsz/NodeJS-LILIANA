const mysql = require('mysql2');

let conexao;
let tentativasDeReconexao = 0;
const maxTentativas = 10;

function handleDisconnect() {
    conexao = mysql.createConnection({
        host: "atendimentos.mysql.uhserver.com",
        port: 3306,
        user: "liliana",
        password: ".rW8k*mKKQMJBB8",
        database: "atendimentos",
        keepAliveInitialDelay: 10000,
        enableKeepAlive: true
    });

    conexao.connect(err => {
        if (err) {
            console.error(`[${new Date().toISOString()}] Erro ao conectar ao MySQL:`, err);
            tentativasDeReconexao++;
            if (tentativasDeReconexao < maxTentativas) {
                console.log(`Tentando reconectar... Tentativa ${tentativasDeReconexao} de ${maxTentativas}`);
                setTimeout(handleDisconnect, 2000); // Tenta reconectar após 2 segundos
            } else {
                console.error('Máximo de tentativas de reconexão atingido. Abortando.');
            }
        } else {
            tentativasDeReconexao = 0;
            console.log(`[${new Date().toISOString()}] Conectado ao MySQL`);
        }
    });

    conexao.on('error', err => {
        console.error(`[${new Date().toISOString()}] Erro na conexão MySQL:`, err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Chama novamente a função para reconectar
        } else {
            throw err; // Lida com outros tipos de erro
        }
    });
}

handleDisconnect();

module.exports = conexao;
