 var socket = io(); //initiating request from client to open conneection and keep it open; socket variable critical to listen
                
 //arrow functions may not work in other browsers
  socket.on('connect', function(){
    console.log('connected to server');

    //emitting only if connected
    socket.emit('createMessage', {
        from: 'alice@examle.com',
        text: 'look at what?'
    });
  });

 //happens when server goes down
 socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

//custom events listener, first argument is data comming from emited event 
socket.on('newMessage', function(message){
    console.log('new Message', message);
});