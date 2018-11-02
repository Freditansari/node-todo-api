/**
 * https://mongoosejs.com/docs/validation.html
 * 
 * https://mongoosejs.com/docs/guide.html
 */
var express = require('express');
var bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const {ObjectID}=require('mongodb');

var {Mongoose} = require('./db/mongoose');
var {Todo} = require('./db/models/todo');
var {User} = require('./db/models/user');

const _ = require('lodash')

var app=express();

app.use(bodyParser.json());

// app.use((req, res, next)=>{
//     var now = new Date().toString();
//    var log =now+ " : "+ req.method + req.url;
//     //the page will freeze without next line
//     fs.appendFile('server.log', log+'\n', (err)=>{if (err){console.log('unable to append file');}})
//      next();

// });

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

app.delete('/todos/:id', (req,res)=>{
    var id =req.params.id;

    if(ObjectID.isValid(id)){
        Todo.findByIdAndDelete(id).then((todo)=>{
            if (!todo){
                //return 404 result if cannot find id
                return res.status(404).send('cannot find id ');
            }
            console.log('removed this todos: ' + todo);
            res.send({todo});
         },(e)=>{
             res.status(404).send(e);
         });
       
    }else{
        return res.status(404).send("invalid id ");
    }

});

app.patch('/todos/:id', (req,res)=>{
    /**todo describe this function in detail so future me does not become dumb ass
     * 1. install lodash to use this route( sudo npm i lodash --save )
    */
    
    var id =req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);


    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed)&& body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed=false;
        body.completedAt = null;
    }

    console.log(id);
    console.log(body);

    Todo.findOneAndUpdate(id,{$set: body}, {new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((e)=>{
        console.log(e);
        res.status(400).send();
    })

});


app.listen(port, ()=>{
    console.log('server is started');
});

//testing purposes
module.exports={app};

