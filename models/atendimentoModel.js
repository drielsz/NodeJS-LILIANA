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
        const sql = `SELECT horario_atendimento from cliente_atendimento WHERE DATA = ?`;
        return this.executaQuery(sql, data)
            .then(resultados => {
                const horariosOcupados = resultados.map(res => res.horario_atendimento.substring(0, 5)); // 'HH:mm'
                
                const horariosDeTrabalho = this.gerarHorariosDeTrabalho(data);
    
                // Criação da data atual ajustada para o fuso horário de São Paulo
                const agora = new Date();
                const timezoneOffset = -3 * 60; // Offset para São Paulo (UTC-3)
                const agoraLocal = new Date(agora.getTime() + timezoneOffset * 60 * 1000);
                const dataAtual = `${agoraLocal.getFullYear()}-${String(agoraLocal.getMonth() + 1).padStart(2, '0')}-${String(agoraLocal.getDate()).padStart(2, '0')}`;
    
                // Converter a data de entrada para o mesmo formato
                const dataConsulta = new Date(data);
                const dataConsultaFormatada = `${dataConsulta.getFullYear()}-${String(dataConsulta.getDate() +1).padStart(2, '0')}-${String(dataConsulta.getMonth() + 1).padStart(2, '0')}`;
    
                console.log("Data Atual:", dataAtual, "Data Consulta Formatada:", dataConsultaFormatada);
    
                // Verificar se a data da consulta é a mesma que a data atual
                if (dataAtual === dataConsultaFormatada) {
                    const horarioAtual = agoraLocal.getHours() * 60 + agoraLocal.getMinutes();
                    return horariosDeTrabalho.filter(horario => {
                        const [hora, minutos] = horario.split(':').map(num => parseInt(num, 10));
                        const horarioDisponivel = hora * 60 + minutos;
    
                        return horarioDisponivel > horarioAtual && !horariosOcupados.includes(horario);
                    });
                } else {
                    // Se não for o mesmo dia, retorna todos os horários disponíveis sem filtrar os passados
                    return horariosDeTrabalho.filter(horario => !horariosOcupados.includes(horario));
                }
            });
    }

}

module.exports = new AtendimentoModel()