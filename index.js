const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const atendimentoController = require("./controllers/atendimentoController"); // Importar o controller

const app = express();
const server = createServer(app); // Criação do servidor HTTP
const port = 3000;

// Configurar WebSocket
const wss = new WebSocketServer({ server, path: "/ws/atendimentos" });

wss.on("connection", async (ws) => {
    console.log("Cliente conectado ao WebSocket!");

    try {
        // Buscar atendimentos do controller
        const atendimentos = await atendimentoController.buscarWebSocket();

        // Enviar os atendimentos para o cliente
        ws.send(JSON.stringify(atendimentos)); 
    } catch (error) {
        console.error("Erro ao buscar atendimentos:", error);
        ws.send(JSON.stringify({ error: "Erro ao buscar atendimentos." }));
    }

    ws.on("message", (message) => {
        console.log("Mensagem recebida do cliente:", message);
        ws.send("Resposta do servidor: " + message);
    });

    ws.on("close", () => {
        console.log("Cliente desconectado.");
    });
});

// Middleware e rotas HTTP
const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'https://nodejs-liliana-production.up.railway.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Importar e usar rotas HTTP
const atendimentoRoutes = require("./routers/atendimento");
app.use("/atendimentos", atendimentoRoutes);

// Iniciar o servidor HTTP com WebSocket
server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
