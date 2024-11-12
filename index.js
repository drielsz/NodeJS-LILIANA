const express = require('express');
const cors = require('cors');
const {createServer} = require('http')
const {WebSocketServer} = require('ws')

const app = express();
const server = createServer(app)
const wss = new WebSocketServer({ server })
wss.on("connection", (ws) => {
    console.log("Cliente conectado!")
    ws.on("message", (message) =>{
        console.log("Message recebida do cliente:", message);
        ws.send("Resposta do servidor: " + message)
    });

    ws.on("close", () => {
        console.log("Cliente desconectado")
    })
})
const port = 3000;
const appCustom = require('./config/appCustom');
const { create } = require('domain');


const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'https://nodejs-liliana-production.up.railway.app', 'https://www.adrielwebdesign.site'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,  
    optionsSuccessStatus: 204 
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
appCustom(app, express);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});