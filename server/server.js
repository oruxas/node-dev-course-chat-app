
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