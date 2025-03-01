const express = require("express");
const { get } = require("http");
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

process.on("SIGINT", () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    console.log("\n Server closing");

    wss.close();
    shutdown();
    process.exit(0);
  });
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

  db.run(
    `
        INSERT INTO visitors (count, time)
        VALUES (?, datetime('now'))
        `,
    [numClients]
  );

  if (ws.readyState === ws.CLOSED) {
    wss.broadcast(`Current Visitors Online: ${numClients}`);
    console.log("Client disconnected");
    getCounts();
  }

  // Listen for client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    getCounts();
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

/* DB */
const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS visitors (
            count INTEGER,
            time DATETIME
        )
        `
  );
});

function getCounts() {
  return db.each(`SELECT * FROM visitors`, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      console.log(row);
    }
  });
}

function shutdown() {
  getCounts();
  console.log("Shutting down db");
  db.close();
}
