class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.createTableAtendimento();
        this.createTableUsers(); // Chama o método para criar a tabela de usuários
        this.createTableCurtidas()
    }

    createTableAtendimento() {
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

        this.conexao.query(sql, (error) => {
            if (error) {
                console.log(`Erro ao criar tabela: ${error.message}`);
            }
        });
    }

    createTableUsers() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(100)
            );
        `;

        this.conexao.query(sql, (error) => {
            if (error) {
                console.log(`Erro ao criar tabela users: ${error.message}`);
            } 
        });
    }


    createTableCurtidas() {
        const sql = ` 
            CREATE TABLE IF NOT EXISTS curtidas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `
        this.conexao.query(sql, (error) => {
            if (error) {
                console.log(`Erro ao criar tabela users: ${error.message}`);
            }
        });
    }
}

module.exports = new Tabelas();
