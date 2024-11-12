const conexao = require("../infraestrutura/conexao")
const { utcToZonedTime } = require('date-fns-tz');
const { format } = require('date-fns');

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


    buscarUserID(id) {
        const sql = `SELECT id, name, email FROM users WHERE id = ?`
        return this.executaQuery(sql, [id])
    }

    verificarEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`
        return this.executaQuery(sql, [email])
    }

    criarUser(novoUsuario) {
        const sql = `INSERT INTO users SET ?`
        return this.executaQuery(sql, novoUsuario)
    }

    gerarHorariosDeTrabalho(data) {
        const diaSemana = new Date(data).getDay();
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
        const sql = `SELECT horario_atendimento FROM cliente_atendimento WHERE DATA = ?`;
        return this.executaQuery(sql, data)
            .then(resultados => {
                const horariosOcupados = resultados.map(res => res.horario_atendimento.substring(0, 5));
                const horariosDeTrabalho = this.gerarHorariosDeTrabalho(data);
    
                let agora = new Date();

                if (process.env.NODE_ENV === 'production'){
                    agora = new Date(new Date().getTime() - 3 * 60 * 60 * 1000); // Ajusta para UTC-3
                }
                // Ajuste para o fuso horário local (UTC-3)
                const dataAtual = agora.toISOString().split('T')[0];
    
                if (dataAtual === data) {
                    const horarioAtualMinutos = agora.getHours() * 60 + agora.getMinutes();
    
                    return horariosDeTrabalho.filter(horario => {
                        const [hora, minutos] = horario.split(':').map(num => parseInt(num, 10));
                        const horarioDisponivelMinutos = hora * 60 + minutos;
    
                        return horarioDisponivelMinutos > horarioAtualMinutos && !horariosOcupados.includes(horario);
                    });
                } else {
                    return horariosDeTrabalho.filter(horario => !horariosOcupados.includes(horario));
                }
            });
    }
}

module.exports = new AtendimentoModel()