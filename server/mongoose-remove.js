const {ObjectID}=require('mongodb');
const {mongoose}= require('./db/mongoose');
const {Todo} = require('./db/models/todo');
const {User} = require('./db/models/user');

Todo.remove({}).then((result)=>{
    console.log(result);
});

//Todo.findByIdAndRemove
//Todo.findOneAndRemove
