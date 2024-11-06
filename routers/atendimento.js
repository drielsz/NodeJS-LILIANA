const { Router } = require('express');
const router = Router();
const atendimentoController = require("../controllers/atendimentoController")
const atendimentoModel = require("../models/atendimentoModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API' })
})

router.post('/curtir', (req, res) => {
    let { post_id } = req.body;

    if (!post_id) {
        return res.status(400).send({ message: 'Post id é obrigatório' })
    }
    const query = atendimentoModel.criarCurtida(post_id)
        .then(() => {
            return res.status(200).send({ message: 'Curtida criada com sucesso' })
        }).catch(err => {
            console.error('Erro ao salvar a curtida', err)
            return res.status(500).send({ message: 'Erro ao salvar a curtida' })
        });
});
// Private router 
router.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id;

    // check
    const user = await atendimentoModel.buscarUserID(id);
    if (user.length === 0) {
        return res.status(404).json({ msg: 'Usuario não encontrado' })
    }

    res.status(200).json({ user })
});

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ msg: 'acesso negado' })
    }


    try {
        const secret = process.env.SECRET;

        jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(400).json({ msg: "token invalido" })
    }
}

router.post("/auth/register", async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

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
});

router.post("/auth/login", async (req, res) => {
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

});

router.get("/atendimentos", atendimentoController.buscar);

// criar
router.post("/criar/atendimento", atendimentoController.criar);

// atualizar
router.put("/atualizar/atendimento/:id", atendimentoController.atualizar);

router.delete("/deletar/atendimento/:id", atendimentoController.deletar);

// horarios disponiveis
router.get("/horarios-disponiveis", atendimentoController.buscarHorariosDisponiveis);

module.exports = router;