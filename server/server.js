
const path = require('path');
const http = require('http');
const express = require ('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();

//app.listen uses the same method
var server = http.createServer(app);
var io = socketIO(server); //getting back web sockets server
//user instance
var users = new Users();

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

   

    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            //error
           return callback('name and room name are required');
        } 

        socket.join(params.room);
        users.removeUser(socket.id);//make sure there is no user with the same id as bellow
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //io.emit -> io.to('name').emit
        //socket.broadcast.emit -> socket.broadcast.to('name).emit
        //socket.emit
         socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));
         socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} just joined the chat!`));
        //socket.leave

        callback();
    });

    //event listener , io.on only used for connection event
    //first arg data to send along with
    socket.on('createMessage', (message, callback)=>{
        console.log('createMessage', message);

        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));  //from user to user to everybody
        }

        //add emit so that incoming message ould be sent to everybody
        //socket.emit emits to a sigle connection, io.emit - to every single connection
        
        callback(); //sends event back to the front end, for multiple use {}, this data ends up in callback in index.js emit callback.
        //broadcast, gets sent to everybody but this socket
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    //listening for createLocationMsg event
    socket.on('createLocationMsg', (coords)=>{
         var user = users.getUser(socket.id);
         if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude,coords.longitude));
         }
    });

    socket.on('disconnect', ()=>{
        console.log('Client disconnected');
        var user = users.removeUser(socket.id);  //storing any potentially removed users

        //do something only if actually deleted
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room)); //update user list
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} just left the chat!`)); //send message
        }    
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