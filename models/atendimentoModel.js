const conexao = require("../infraestrutura/conexao")
class AtendimentoModel {

    executaQuery(sql, parametros = "") {
        return new Promise ((resolve, reject) => {
            conexao.query(sql, parametros, (err, resposta) => {
                if(err) {
                    return reject(err)
                }
                return resolve(resposta)
            })
        })
    }
    listar() {
        const sql = "SELECT * FROM cliente_atendimento";
        return this.executaQuery(sql)
    }
    criar(novoAtendimento) {
        const sql = "INSERT INTO cliente_atendimento SET ?"
        return this.executaQuery(sql, novoAtendimento)
    }

    atualizar(atendimentoAtt, id) {
        const sql = "UPDATE cliente_atendimento SET ? WHERE id = ?"
        return this.executaQuery(sql, [atendimentoAtt,id])
    }

    deletar(id) {
        const sql = `DELETE FROM cliente_atendimento WHERE id = ?`
        return this.executaQuery(sql,id)
    }
}

module.exports = new AtendimentoModel()