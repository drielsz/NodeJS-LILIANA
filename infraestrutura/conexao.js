const mysql = require('mysql2');

let conexao;

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
            console.log('Erro ao conectar ao MySQL:', err);
            setTimeout(handleDisconnect, 2000); // Tenta reconectar após 2 segundos
        } else {
            console.log('Conectado ao MySQL');
        }
    });

    conexao.on('error', err => {
        console.log('Erro na conexão MySQL:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Chama novamente a função para reconectar
        } else {
            throw err; // Lida com outros tipos de erro
        }
    });
}

handleDisconnect();

module.exports = conexao;
