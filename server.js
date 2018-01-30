// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('primary.cert')
};

var app = require('express')(),
    server = https.createServer(options, (req, res) => {
        try {
            fs.readFile('./index.html', 'utf-8', function (error, content) {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            });

        } catch (e)
        {
            var error = e;
        }

    }),
    io = require('socket.io').listen(server),
    ent = require('ent');

var express = require('express');
app.use(express.static("public"));

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('nouveau_client', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
        console.log("Nouvel utilisateur :", pseudo);
    });
    
    socket.on('message', function (message) {
        //message = ent.encode(message);
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
        console.log("Nouveau message de", socket.pseudo);
    });
});
var port = process.env.PORT || 8000;
server.listen(port);

