var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), 
    fs = require('fs');

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

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
        //ShowIcon(message);
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message });
        console.log("Nouveau message de", socket.pseudo);
        console.log("Nouveau message de", ShowIcon(message));
    });
});
var port = process.env.PORT
server.listen('8080');

function ShowIcon(message) {
    message = ReplaceRacourciParEmoticon(message, ":))", "s_radieu");
    message = ReplaceRacourciParEmoticon(message ,":)", "s_joie");
    message = ReplaceRacourciParEmoticon(message,":|", "s_surprise");
    message = ReplaceRacourciParEmoticon(message,":(", "s_degout");
    console.log(message);
    return message;
}

function ReplaceRacourciParEmoticon(message, raccourci, emoticon) {
    return ReplaceAll(message, raccourci, '<img src="img/' + emoticon + '.png" />');
}

function ReplaceAll(chaine, aTrouve, remplace) {
    while (chaine.indexOf(aTrouve) != -1) {
        chaine = chaine.replace(aTrouve, remplace);
    }

    return chaine;
}