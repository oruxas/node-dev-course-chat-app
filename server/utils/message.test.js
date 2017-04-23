var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message.js'); //same directory thus ./

describe('generateMessage', ()=>{
    it('should generate correct message object', ()=>{
        var from = "alice";
        var text = "some message";
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    });
});

describe('generateLocationMessage',()=>{
    it('should generate correct location object', ()=>{
        var from = "alice";
        var latitude= 12;
        var longitude= 6;
        var url = 'https://www.google.com/maps?q=12,6'; //what i am expecting 
        var message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
    });
});