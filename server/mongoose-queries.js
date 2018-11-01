const {ObjectID}=require('mongodb');
const {mongoose}= require('./db/mongoose');
const {Todo} = require('./db/models/todo');

var id = '5bdaad94202ec4264d8f2154';

if(!ObjectID.isValid(id)){
    console.log('invalid id');
}

// Todo.find({text:"burn some weed"}).then((todos)=>{
//     console.log("FROM FIND");
//     console.log(todos);
// });

// Todo.findOne({_id:id}).then((todo)=>{
//     console.log("FROM FIND ONE");
//     console.log(todo)
// });

Todo.findById(id).then((todo)=>{
    if(!todo){
        return console.log('id not found');
    }
    console.log("FROM FIND by id");
    console.log(todo)
}).catch((e)=>{console.log(e)});