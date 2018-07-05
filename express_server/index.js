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
const jwtAuth = require('socketio-jwt-auth');

// Instantiating the express-jwt middleware
const jwtMW = exjwt({
		secret: 'keyboard cat 4 ever'
});

// socket middleware used for authentication
io.use(
	jwtAuth.authenticate({
			secret: 'keyboard cat 4 ever'    // required, used to verify the token's signature
		}, 
		(payload, done) => {
			if (!payload.username){
				return done(null, false, 'user does not exist');
			}
			return done(null, payload.username);
		}
	)
);

// cors is required for access
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
	next();
});

app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
	// Request a message from the server
	if (req.metaAuth && req.metaAuth.challenge) {
		res.send(req.metaAuth.challenge)
	}
});

app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
	if (req.metaAuth && req.metaAuth.recovered) {
		// Signature matches the cache address/challenge
		// Authentication is valid, assign JWT, etc.
		let token = jwt.sign({ username: req.metaAuth.recovered }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
		// res.send(req.metaAuth.recovered);
		res.json({ sucess: true,err: null,token});

	} else {
		// Sig did not match, invalid authentication
		res.status(400).send();
	}
});

app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
	console.log('getting request');
	
	res.json({
		sucess: true,
		err: null,
		message:'you are authenticated'
	});
});

io.on("connection", socket => {
	console.log("New client connected");
	console.log(socket.request.user);
	socket.join('my-room');
	// console.log(io.sockets.adapter.rooms);
	// console.log(Object.keys(io.sockets.adapter.rooms).filter( key => io.sockets.adapter.rooms[key].length > 1));
	socket.on('from client', (data) => {
		io.emit('from server', `Number of users ${io.sockets.adapter.rooms['my-room'].length}` );
	});

	if (io.sockets.adapter.rooms['my-room'].length == 4) {
		io.emit('start game',"games");
	}
	
	socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
