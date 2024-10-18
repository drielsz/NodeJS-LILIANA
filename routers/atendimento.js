const { Router } = require('express');
const router = Router();
const atendimentoController = require("../controllers/atendimentoController")

router.get("/atendimentos", atendimentoController.buscar)

// criar
router.post("/criar/atendimento", atendimentoController.criar)

// atualizar
router.put("/atualizar/atendimento/:id", atendimentoController.atualizar)

router.delete("/deletar/atendimento/:id", atendimentoController.deletar)

module.exports = router;