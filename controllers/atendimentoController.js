const atendimentoModel = require('../models/atendimentoModel')

class AtendimentoController {
    buscar(req, res) {
        const listaAtendimentos = atendimentoModel.listar()
        return listaAtendimentos.then(atendimentos => res.status(200).json(atendimentos)
        ).catch(error => res.status(400).json(error.message))
    }
    criar(req, res) {
        const novoAtendimento = req.body;
        const atendimento = atendimentoModel.criar(novoAtendimento);
        return atendimento.then(atendimentos => res.status(200).json(atendimentos)
        ).catch(error => res.status(400).json(error.message))
    }
    atualizar(req, res) {
        const { id } = req.params;
        const atendimentoAtt = req.body;
        const atendimento = atendimentoModel.atualizar(atendimentoAtt, id)
        return atendimento
            .then((resultatendimento) =>
                res.status(200).json(resultatendimento)
            )
            .catch((error) => res.status(400).json(error.message))
    }
    deletar(req, res) {
        const { id } = req.params;
        const atendimento = atendimentoModel.deletar(id);
        return atendimento
            .then((resultatendimento) =>
                res.status(200).json(resultatendimento)
            )
            .catch((error) => res.status(400).json(error.message))
    }
}

module.exports = new AtendimentoController();