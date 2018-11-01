/**
 * https://mongoosejs.com/docs/validation.html
 * 
 * https://mongoosejs.com/docs/guide.html
 */

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

 //trim is to remove leading and trailing whitespaces
// var Todo = mongoose.model('Todo',{
//     text:{
//         type : String,
//         required: true,
//         minlength: 3,
//         trim:true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt:{
//         type: Number,
//         default:null
//     }
// });

// var newTodo = new Todo({text:'edit this video'});
// newTodo.save().then((doc) =>{
//     console.log('saved ', doc)

// }, (error)=>{
//     console.log(error);
// });

var user = mongoose.model('User',{
    email:{
        type: String,
        required: true,
        trim: true,
        minlength:1
    }
});

var newUser = new user({email: 'freditansari@gmail.com'});

newUser.save().then((doc)=>{
    console.log(doc)
}, (error)=>{
    console.log(error)
});
