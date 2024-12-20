const atendimentoModel = require('../models/atendimentoModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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

    buscarHorariosDisponiveis(req, res) {
        const { data } = req.query;
        const atendimento = atendimentoModel.listarHorariosDisponiveis(data)
        return atendimento
            .then(horarios => res.status(200).json(horarios))
            .catch(error => res.status(400).json(error.message));
    }

    async criarUsuario(req, res) {
        const { name, email, password, confirmpassword } = req.body
        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatorio" })
        }

        if (!email) {
            return res.status(422).json({ msg: "O email é obrigatorio" })
        }

        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatoria" })
        }

        if (password !== confirmpassword) {
            return res.status(422).json({ msg: "As senhas não são iguais" })
        }

        const userExists = await atendimentoModel.verificarEmail(email);

        if (userExists.length > 0) {
            return res.status(422).json({ msg: "Por favor, utilize outro e-mail" })
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user

        const novoUsuario = { name, email, password: passwordHash }

        try {
            await atendimentoModel.criarUser(novoUsuario);
            res.status(201).json({ msg: 'usuario criado com sucesso' })
        }
        catch (error) {
            console.log(error)
            if (error.code === 'ER_DUP_ENTRY') { // Verifique se o código do erro indica duplicata
                return res.status(422).json({ msg: "Por favor, utilize outro e-mail." });
            }

            res.status(500).json({ msg: "Erro ao criar o usuario." })
        }
    }


    async checkUsuario(req, res) {
        const id = req.params.id;

        // check
        const user = await atendimentoModel.buscarUserID(id);
        if (user.length === 0) {
            return res.status(404).json({ msg: 'Usuario não encontrado' })
        }

        res.status(200).json({ user })
    }
    
    async authLogin(req, res) {
        const { email, password } = req.body

        if (!email) {
            return res.status(422).json({ msg: "O email é obrigatorio" })
        }
    
        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatoria" })
        }
        // check
        const user = await atendimentoModel.verificarEmail(email);
    
        if (user.length === 0) { //Se não foi encontrado
            console.log(user)
            return res.status(404).json({ msg: "Usuario não encontrado" })
        }
    
        // check pass
    
        const checkPassword = await bcrypt.compare(password, user[0].password)
    
        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida! " })
        }
    
        try {
            const secret = process.env.SECRET
    
            const token = jwt.sign({
                id: user[0].id
            },
                secret,
            )
            res.status(200).json({ msg: "aut realizada com sucesso", token })
        } catch (err) {
            console.log(err)
    
            res.status(500).json({
                msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
            })
        }
    }

}

module.exports = new AtendimentoController();