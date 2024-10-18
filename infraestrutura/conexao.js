const mysql = require('mysql2')

const conexao = mysql.createConnection({
    host: "atendimentos.mysql.uhserver.com",
    port: 3306,
    user: "liliana",
    password: ".rW8k*mKKQMJBB8",
    database: "atendimentos"
})

module.exports = conexao;