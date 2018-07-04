const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const MetaAuth = require('meta-auth');

const port = 4000;
const app = express()
const metaAuth = new MetaAuth({banner:"this is to verify your ethereum address"});

const server = http.createServer(app);
const io = socketIo(server);

const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

// INstantiating the express-jwt middleware
const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});

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
    let token = jwt.sign({ username: req.metaAuth.recovered }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
    // res.send(req.metaAuth.recovered);
    res.json({ sucess: true,err: null,token});

  } else {
    // Sig did not match, invalid authentication
    res.status(400).send();
  };
});

app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
    console.log('getting request');
    // res.send('You are authenticated'); //Sending some response when authenticated
    res.json({
                sucess: true,
                err: null,
                message:'you are authenticated'
            });
});

io.on("connection", socket => {
  console.log("New client connected");

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
