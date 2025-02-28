const express = require("express");
const server = require("http").createServer();
const port = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log(`Client connected, total: ${numClients}`);

  wss.broadcast(`
            Current Visitors Online: ${numClients}
        `);

  if (ws.readyState === ws.OPEN) {
    ws.send(` Welcome to FSFE `);
  }
  if (ws.readyState === ws.CLOSED) {
    wss.broadcast(`Current Visitors Online: ${numClients}`);
    console.log("Client disconnected");
  }
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};
