//1. npm -i jsonwebtoken --save
const jwt = require('jsonwebtoken');

var data ={id:30568};

var token =jwt.sign( data, '123abcc');
console.log(token);

var decoded = jwt.verify(token, '123abcc');
console.log(decoded);

