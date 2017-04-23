
const path = require('path');
const http = require('http');
const express = require ('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();

//app.listen uses the same method
var server = http.createServer(app);
var io = socketIO(server); //getting back web sockets server


app.use(bodyParser.json());
//serve static files
app.use(express.static(publicPath));

//lets register event listener
//socket similar to socket in index.html, represents individual  
io.on('connection', (socket)=>{
    console.log('new user connected');

    //emit event with matching name and optionally specify data
    
    //no longer needed cuz io.emit
    // socket.emit('newMessage', {
    //     from: 'bob@example.com',
    //     text: "Hai, take a look",
    //     createdAt: 133
    // });

    socket.emit('newMessage',{
        from: "Admin",
        text: "welcome to chat",
        createdAt: new Date().getTime()
    });
    socket.broadcast.emit('newMessage', {
        from: "Admin",
        text: "New User just joined",
        createdAt: new Date().getTime()
    })


    //event listener , io.on only used for connection event
    //first arg data to send along with
    socket.on('createMessage', (message)=>{
        console.log('createMessage', message);
        //add emit so that incoming message ould be sent to everybody
        //socket.emit emits to a sigle connection, io.emit - to every single connection
        io.emit('newMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        //broadcast, gets sent to everybody but this socket
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', ()=>{
        console.log('Client disconnected');
    });
});

//previuosly app.listen
server.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
})

//notes
//websockets are persistent.
//client and server both keep communication channel open
//if connection drops on one of those then other has to drop too.
//client still gonna trie to reconnect