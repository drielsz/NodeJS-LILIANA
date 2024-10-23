const conexao = require("../infraestrutura/conexao")
class AtendimentoModel {

    executaQuery(sql, parametros = "") {
        return new Promise((resolve, reject) => {
            conexao.query(sql, parametros, (err, resposta) => {
                if (err) {
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
        return this.executaQuery(sql, [atendimentoAtt, id])
    }

    deletar(id) {
        const sql = `DELETE FROM cliente_atendimento WHERE id = ?`
        return this.executaQuery(sql, id)
    }

    gerarHorariosDeTrabalho(data) {
        const diaSemana = new Date(data).getDay();
        console.log("Dia da semana:", diaSemana); // Verificar se o dia está correto
        let horarios = []

        if (diaSemana >= 2 && diaSemana <= 5) {
            horarios = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        }
        else if (diaSemana === 6) {
            horarios = ['09:00', '10:00', '11:00', '12:00', '13:00'];
        }
        return horarios;
    }

    listarHorariosDisponiveis(data) {
        console.log(`data recebida: ${data}`)
        const sql = `SELECT horario_atendimento from cliente_atendimento WHERE DATA = ?`;
        return this.executaQuery(sql, data)
        .then(resultados => {
            console.log("Horários ocupados da query:", resultados); // Verificando o resultado da query SQL
            const horariosOcupados = resultados.map(res => res.horario_atendimento.substring(0, 5)); // 'HH:mm'
            console.log("Horários ocupados processados:", horariosOcupados); // Verificando os horários ocupados
            
            const horariosDeTrabalho = this.gerarHorariosDeTrabalho(data);
            console.log("Horários de trabalho:", horariosDeTrabalho); // Verificando os horários gerados para o dia
            
            const horariosDisponiveis = horariosDeTrabalho.filter(horario => !horariosOcupados.includes(horario));
            console.log("Horários disponíveis:", horariosDisponiveis); // Verificando o resultado final
    
            return horariosDisponiveis;
        });
    }
}

module.exports = new AtendimentoModel()