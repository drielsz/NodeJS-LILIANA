const { Router } = require('express');
const router = Router();
const atendimentoController = require("../controllers/atendimentoController")

router.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API' })
})

// Private router 
router.get("/user/:id", checkToken, atendimentoController.checkUsuario)

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

router.post("/auth/register", atendimentoController.criarUsuario)

router.post("/auth/login", atendimentoController.authLogin)

router.get("/atendimentos", atendimentoController.buscar);

// criar
router.post("/criar/atendimento", atendimentoController.criar);

// atualizar
router.put("/atualizar/atendimento/:id", atendimentoController.atualizar);

router.delete("/deletar/atendimento/:id", atendimentoController.deletar);

// horarios disponiveis
router.get("/horarios-disponiveis", atendimentoController.buscarHorariosDisponiveis);

module.exports = router;