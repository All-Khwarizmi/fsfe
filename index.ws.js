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
