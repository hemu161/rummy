const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const MetaAuth = require('meta-auth');

const port = 4000;
const app = express()
const metaAuth = new MetaAuth({banner:"this is to verify your ethereum address"});

const server = http.createServer(app);
const io = socketIo(server);


app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Request a message from the server
  if (req.metaAuth && req.metaAuth.challenge) {
    res.send(req.metaAuth.challenge)
  }
});

app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  console.log(req.metaAuth);
  if (req.metaAuth && req.metaAuth.recovered) {
    // Signature matches the cache address/challenge
    // Authentication is valid, assign JWT, etc.
    res.send(req.metaAuth.recovered);
  } else {
    // Sig did not match, invalid authentication
    res.status(400).send();
  };
});

app.get('/',(req, res) => {
  res.send({ response: "I am alive" }).status(200);
});	

io.on("connection", socket => {
  console.log("New client connected");

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
