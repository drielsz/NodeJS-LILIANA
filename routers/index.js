const routerAtendimento = require('./atendimento'); // Importa suas rotas

module.exports = (app, express) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    app.use(routerAtendimento); // Usa o router importado
};