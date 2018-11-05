//install validator package from npm i validator --save
//install bcrypt package from npm i bcryptjs --save

var mongoose= require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

var UserSchema =new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength:1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid e-mail'
        } 
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required: true
        },
        token:{
            type:String,
            required: true
        }
    }]
});

/**
 * this method affects all methods accessing User documents in mongodb.
 * by default it has toJSon and toObject
 */


UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id', 'email'])
}

// this line does not work. Looking for answers when it works /not on udemy
//Note: according to the tutorial, the concat sometimes work, sometimes don't.
// we'll have to find out what's the parameter for it to work/not
// UserSchema.methods.generateAuthToken = function(){
//     var user = this;
//     var access ='auth';
//     var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();
//
//     //push a value into array
//     user.tokens = user.tokens.concat([{access, token}]);
//     user.save().then(()=>{
//         return token
//     });
// };

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken= function(token){
    var user = this;

    return user.update({
        $pull:{
            tokens:{
                token
                //token: token(same stuff)
            }
        }
    });
};

//statics is almost the same like methods, but only difference it returns model method instead of instance method
/**
 * find by token checks the token is actual our server side token or not by verifiying if its true or not. 
 * It also compares it against the secret.
 */
UserSchema.statics.findByToken= function(token){
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (error) {
        // return new Promise((resolve, reject)=>{
        //     reject()
        // });
        return Promise.reject();
    }

    //this is how to find nested objects
    return User.findOne({
        '_id': decoded._id,
        'tokens.token' : token,
        'tokens.access': 'auth'
    });
};


// UserSchema.statics.findByCredentials = function(email, password){
//     var User = this;
//
//     return User.findOne({email}).then((user)=>{
//         if(!user){
//             return Promise.reject();
//         }
//
//         return new Promise((resolve, reject)=>{
//             bcrypt.compare(password, user.password, (error, response)=>{
//                 if(response){
//                     resolve(user);
//                 }else{
//                     reject();
//                 }
//             });
//
//         });
//
//
//     });
// }
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;


    return User.findOne({email:email}).then((user) => {
        if (!user) {
            return Promise.reject();

        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();

                }
            });
        });
    });
};

/**
 * monggose middleware functions.
 * https://mongoosejs.com/docs/middleware.html
 *
 * this one is before save method being fired. it checks if the user is modified or not.
 *
 */

UserSchema.pre('save', function(next){
    var user = this;


    if (user.isModified('password')){

        bcrypt.genSalt(10, (error, salt)=>{
        bcrypt.hash(user.password, salt, (err,hash)=>{
                user.password=hash;
                next();

            });
        });


    }else {
        next();
    }
});





var User = mongoose.model('User',UserSchema);
module.exports={User};