var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), 
    fs = require('fs');

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('nouveau_client', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
        console.log("Nouvel utilisateur :", pseudo);
    });
    
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
        console.log("Nouveau message de", socket.pseudo);
    });
});
var port = process.env.PORT
server.listen(port);