const express = require("express"),
    app = express(),
    http = require("http");

let database = require("../database/database");

app.use(express.json())

app.get('/', function (req, res) {
    res.send("MARTIAN ROBOTS");
});

app.get('/robots', async (req, res) => {
    console.log('GET /robots')
    let resp = await database.MongoBot.getAllRobots()
    res.send(resp)
})

app.get('/robots/lost', async (req, res) => {
    console.log('GET /robots/lost')
    let resp = await database.MongoBot.getLostRobots()
    res.send(resp)
})


async function iniciar() {
    app.listen(8001, async function () {
        console.log("Servidor de Node.js levantado en http://localhost:8001");
        await database.MongoBot.init()
    });
    await database.MongoBot.client.close().then(console.log("Desconectado"))
}

iniciar()