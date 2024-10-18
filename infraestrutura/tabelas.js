class Tabelas {
    init(conexao){
        this.conexao = conexao;
        this.createTableAtendimento();
    }
    createTableAtendimento(){
        const sql = 
        `
            CREATE TABLE IF NOT EXISTS cliente_atendimento (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            DATA DATE, 
            horario_atendimento TIME,
            servico VARCHAR(100),
            cliente VARCHAR(100),
            STATUS ENUM ("ativo", "realizado", "cancelado") DEFAULT "ativo"
        );
        `;

        this.conexao.query(sql, (error) => {
            if(error){
                console.log(`error ${error.message}`)
                return;
            }
            console.log(200)
        })
    }
}

module.exports = new Tabelas();