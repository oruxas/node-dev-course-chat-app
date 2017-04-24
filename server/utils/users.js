[{
    id: '',
    name: '',
    room: ''
}]


class Users {
    constructor (){
       this.users = [];   
    }
    addUser(id, name, room){
        var user = {id, name, room}
        this.users.push(user);
        return user;
    }
    removeUser(id){
        //return user that was removed
        var user = this.users.filter((user)=> user.id === id)[0]; //this.getUser(id) would also work
        if(user){
            this.users = this.users.filter((user)=>user.id !== id); // return all users whos id does not match
        }
        return user;
    }
    getUser(id){
        return this.users.filter((user)=> user.id === id)[0];   //returns first item
    }
    getUserList(room){
        var users = this.users.filter((user)=> user.room === room);
        var namesArray = users.map((user)=> user.name);

        return namesArray;
    }
}

module.exports = {Users};

//addUser(id, name, room)
//removeUser(id)
//getId(id)
//getUserList(room)

//ES6 Classes

// class Person{
//     //constructor function special for class, it automatically fires .
//     //lets initialize instance of class
//     constructor (name, age) {
//         //gets called automatically with arguments specified at new Class(args);
//         //console.log(name, age);

//         //to modify instance:
//         this.name = name;
//         this.age = age;
//     }
//     getUserDescription(){
//         return `${this.name} is ${this.age} years old`
//     }
// }
// var me = new Person('Evaldas', 22);
// var description = me.getUserDescription();


// // console.log('this.name', me.name);
// // console.log('this.age', me.age);
// console.log(description)