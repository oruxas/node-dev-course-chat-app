const expect = require('expect');

const {Users} = require('./users');

describe('Users', ()=>{

    var users;
    beforeEach(()=>{
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'slasher'
        },{
            id: '2',
            name: 'Josh',
            room: 'Nope'
        }, {
            id: '3',
            name: 'Sabina',
            room: 'slasher'
        }]
    });

    it('should add new user', ()=>{
        var users = new Users();
        var user = {
            id : '124',
            name : 'Evaldas',
            room : 'Secret'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        //first one  is this variable, second is array
        expect(users.users).toEqual([user]);
     });

     it('should remove a user', ()=>{
        var userId = '1';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
     });

     it('should not remove a user', ()=>{
        var userId = '666';
        var user = users.removeUser(userId);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
     });

     it('should find a user', ()=>{
        var userId = '2';
        var user = users.getUser(userId);
        expect(user.id).toBe(userId);
     });

     it('should not find a user', ()=>{
        var userId = '6';
        var user = users.getUser(userId);
        expect(user).toNotExist(); //first item coming from getUser's empty list should be undefined
     });

     it('should return names for slasher room',()=>{
        var userList = users.getUserList('slasher');
        expect(userList).toEqual(['Mike', 'Sabina']);
     });

     it('should return names for Nope room',()=>{
        var userList = users.getUserList('Nope');
        expect(userList).toEqual(['Josh']);
     });


});