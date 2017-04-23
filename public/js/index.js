 var socket = io(); //initiating request from client to open conneection and keep it open; socket variable critical to listen
                
 //arrow functions may not work in other browsers
  socket.on('connect', function(){
    console.log('connected to server');
  });

 //happens when server goes down
 socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

//custom events listener, first argument is data comming from emited event 
socket.on('newMessage', function(message){
    console.log('new Message', message);
    //render out incoming messages in ol
    var li = jQuery("<li></li>");
    li.text(`${message.from}: ${message.text}`);  //ES6: `${message.from}: ${message.text}`

    jQuery('#messages').append(li);
});

//acknowledge, no longer needed, we have form
// socket.emit('createMessage', {
//     from: "Josh",
//     text: "aloha"
// }, function(data){  //data comes from callback in server.js
//     //when acknowledgement arrives at client
//     console.log('got it', data);
// });


jQuery('#messageForm').on('submit', function(e){
    //need to access arg in order to override default behaviour that causes browser to refresh
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){
        //for acknowledgement
    });
});