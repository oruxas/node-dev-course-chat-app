//unix epoch
//jan 1st 1970 00:00:00 am

//-1000 would be december 31st 1969 11:59:59 , 1 sec past from above in js its stored in millisecs
var moment = require('moment');

// // new Date().getTime();

// // var date = new Date();
// // console.log(date.getMonth());

// var date = moment();
// //date.add(1, 'years').subtract(9, "months");

// //console.log(date.format("MMM"));
// //MMM - short hand of curr month
// //YYYY year in numbers
// console.log(date.format("YYYY MMM"));

// console.log(date.format("MMM Do YYYY"));

var someTimestamp =  moment().valueOf(); //in millisecs since unix
console.log(someTimestamp);
var createdAt = 12354;

var date = new moment(createdAt);
console.log(date.format('h:mm a'));