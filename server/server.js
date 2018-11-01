/**
 * https://mongoosejs.com/docs/validation.html
 * 
 * https://mongoosejs.com/docs/guide.html
 */
var express = require('express');
var bodyParser = require('body-parser');

const port = process.env.port || 3000;
const {ObjectID}=require('mongodb');

var {Mongoose} = require('./db/mongoose');
var {Todo} = require('./db/models/todo');
var {User} = require('./db/models/user');

var app=express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    //this line is to check request made body  => console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);

    }, (error)=>{
        res.status(400).send(error);

    });
});

app.get('/todos',(req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos/:id',(req, res)=>{
     var id =req.params.id;
     console.log(req.params);


    if(ObjectID.isValid(id)){
        Todo.findById(id).then((todo)=>{
            if (!todo){
                //return 404 result if cannot find id
                return res.status(404).send('cannot find id ');
            }
            res.send({todo});
         },(e)=>{
             res.status(404).send(e);
         });
       
    }else{
        return res.status(404).send("invalid id ");
    }
    
});


app.listen(port, ()=>{
    console.log('server is started');
});

//testing purposes
module.exports={app};

