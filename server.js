

//Lets require/import the HTTP module

//We need a function which handles requests and send response
//function handleRequest(request, response) {
//    response.end('It Works!! Path Hit: ' + request.url);
//}

//Create a server
//var server = http.createServer(handleRequest);

//Lets start our server
//server.listen(PORT, function () {
//    //Callback triggered when server is successfully listening. Hurray!
//    console.log("Server listening on: http://localhost:%s", PORT);
//});

//var http = require('http');
//var port = process.env.PORT || 1337;
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);


var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');

// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');

    //res.writeHead(200, { 'Content-Type': 'text/html' });
    //fs.readFile('index.html', function (err, data) {
    //    res.end(data);
    //});
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
        console.log("Nouvel utilisateur :", pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
        console.log("Nouveau message de", socket.pseudo);
    });
});
var port = process.env.PORT
server.listen(port);