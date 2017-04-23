
const path = require('path');
const http = require('http');
const express = require ('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
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

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined the chat!'));


    //event listener , io.on only used for connection event
    //first arg data to send along with
    socket.on('createMessage', (message, callback)=>{
        console.log('createMessage', message);
        //add emit so that incoming message ould be sent to everybody
        //socket.emit emits to a sigle connection, io.emit - to every single connection
        io.emit('newMessage',generateMessage(message.from, message.text));  //from user to user
        callback('This is from server'); //sends event back to the front end, for multiple use {}, this data ends up in callback in index.js emit callback.
        //broadcast, gets sent to everybody but this socket
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    //listening for createLocationMsg event
    socket.on('createLocationMsg', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude,coords.longitude));
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