 var socket = io(); //initiating request from client to open conneection and keep it open; socket variable critical to listen


 function scrollToBottom(){
    //selectors
        var messages = jQuery('#messages');

        //last list item
        var newMessage = messages.children('li:last-child');
    //Heights
        var clientHeight = messages.prop('clientHeight'); //visible height of messages container
        var scrollTop = messages.prop('scrollTop'); //num of pixels scrolled into container
        var scrollHeight = messages.prop('scrollHeight'); //total height of container, regardless of how much is visible
        var newMessageHeight = newMessage.innerHeight(); //last messages height including padding with css
        //second to last
        var lastMessgeHeight = newMessage.prev().innerHeight();

        if(clientHeight + scrollTop + newMessageHeight + lastMessgeHeight>= scrollHeight){
            //console.log('Should scroll');
            messages.scrollTop(scrollHeight);            
        }
 };


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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();               //.html returns message tags inside template
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();

    //old way
    // console.log('new Message', message);
    // //render out incoming messages in ol
    // var li = jQuery("<li></li>");
    // li.text(`${message.from} (${formattedTime}): ${message.text}`);  //ES6: `${message.from}: ${message.text}`

    // jQuery('#messages').append(li);
});

//acknowledge, no longer needed, we have form
// socket.emit('createMessage', {
//     from: "Josh",
//     text: "aloha"
// }, function(data){  //data comes from callback in server.js
//     //when acknowledgement arrives at client
//     console.log('got it', data);
// });


//event listener for createLocationMsg event
socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from, 
        url: message.url,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery("<li></li>");
    // var a = jQuery("<a target='_blank'>My current location</a>"); //target _blank tells to open in new tab
    // li.text(`${message.from} (${formattedTime}): `);
    // a.attr('href', message.url);  

    // li.append(a);
    // jQuery('#messages').append(li);
});



jQuery('#messageForm').on('submit', function(e){
    //need to access arg in order to override default behaviour that causes browser to refresh
    e.preventDefault();
   
   var msgTextbox = jQuery('[name=message]');
    
    socket.emit('createMessage', {
        from: 'User',
        text:  msgTextbox.val()
    }, function(){
        //for acknowledgement
        //clear value once server has received it
         msgTextbox.val('');
    });
});

var locationBtn = jQuery('#sendLocation');
locationBtn.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationBtn.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        //console.log(position);
        locationBtn.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMsg',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationBtn.removeAttr('disabled').text('Send location');
        alert('unable to fetch location');
    });
});