class Tabelas {
    async init(conexao) {
        this.conexao = conexao;
        await this.createTableAtendimento(); // Use await para garantir que a tabela seja criada antes de continuar
    }

    async createTableAtendimento() {
        const sql = `
            CREATE TABLE IF NOT EXISTS cliente_atendimento (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            DATA DATE, 
            horario_atendimento TIME,
            servico VARCHAR(100),
            cliente VARCHAR(100),
            STATUS ENUM ("ativo", "realizado", "cancelado") DEFAULT "ativo"
        );
        `;

        try {
            await this.conexao.query(sql); // Usando await com a query
            console.log(200); // Sucesso
        } catch (error) {
            console.log(`error ${error.message}`); // Captura erros
        }
    }
}

module.exports = new Tabelas();
