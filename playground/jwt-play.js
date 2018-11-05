//1. npm -i jsonwebtoken --save
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

var data ={id:30568};

var token =jwt.sign( data, '123abcc');
console.log(token);

var decoded = jwt.verify(token, '123abcc');
console.log(decoded);

// var password = '123abc'
// bcrypt.genSalt(15, (error, salt)=>{
//     bcrypt.hash(password, salt, (err,hash)=>{
//         console.log(hash);
//
//     });
// });

var hashedpassword = '$2a$15$N1Xcp/4RSAZ9Mxq0gAoovuutDlCTR7YV95UjkyAftSbAwgROlOXiu'
bcrypt.compare('123abc', hashedpassword, (error, result)=>{
    console.log(result);
});