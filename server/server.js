/**
 * https://mongoosejs.com/docs/validation.html
 * 
 * https://mongoosejs.com/docs/guide.html
 */
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

const port = process.env.PORT || 3000;
const {ObjectID}=require('mongodb');

var {Mongoose} = require('./db/mongoose');
var {Todo} = require('./db/models/todo');
var {User} = require('./db/models/user');
var {authenticate} = require('./middleware/authenticate')


const _ = require('lodash')

var app=express();
app.use(cors());

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
     * 2. we use lodash pick so that the user control what user can/cannot change
     *
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

/**
 * USERS
 */

//this route is for people to register new user. it takes only email and password for now.
app.post('/users', (req, res)=>{
    //this line is to check request made body  => console.log(req.body);
    //this line below is to pick only email and password so that clients cannot put in junks into the body
    var body = _.pick(req.body, ['email', 'password']);
    

    var user = new User(body);
    

    user.save().then(()=>{
        return user.generateAuthToken();
        //res.send(user);

    }).then((token)=>{
        //you can disable this "then" to stop user from automatically logged in after sigining up 
        res.header('x-auth',token).send(user);

    }).catch((e)=>{
        res.status(400).send(e);
    });
});

//this route  is to get users list from the database. It might be not a good idea to provide this.
app.get('/users',(req, res)=>{
   User.find({'tokens.access':'admin'}).then((users)=>{
        res.send({users});
    },(e)=>{
        res.status(400).send(e);
    });
});

// app.post('/users/login', (req, res)=>{
//     var body = _.pick(req.body, ['email', 'password']);
//
//     return User.findByCredentials(body.email, body.password).then((user)=>{
//         console.log(user);
//         return user.generateAuthToken().then((token)=>{
//              res.header('x-auth',token).status(200).send(user);
//
//         });
//
//     }).catch((error)=>{
//         res.status(400).send("invalid credentials");
//     });
//
// });

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);


    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth',token).status(200).send(user);
        });

        // console.log(user);
        // res.status(200).send('OK');
    }).catch((e) => {
        res.status(400).send();

    });
});

/**
 * check the token registered or not. 
 * if its registered it will gives back email and user ID. if its not it will returns 400 bad request. 
 * This method is being controlled by authenticate middleware in ./middleware/authenticate.js.
 * 
 * Also by putting authenticate method like this. It will ask the user to login and get the jwt token before
 * accesing the method. 
 */
app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
    
});


/**
 * logout method.
 * */
app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }, () =>{
        res.status(400).send();
    });

});

app.listen(port, ()=>{
    console.log('server is started');
});

//testing purposes
module.exports={app};

