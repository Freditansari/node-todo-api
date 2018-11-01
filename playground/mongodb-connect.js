const MongoClient = require('mongodb').MongoClient;
/**
 * how to enter data to mongo db
 */
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err){
        return console.log('unable to connect to mongodb');
    }
    console.log('connected to mongodb ');

    db.collection('Todos').insertOne({
        text: 'is it in yet? ',
        completed: false
    }, (err, result) =>{
        if (err){
            return console.log('unable to insert todo ', err);
        }
        console.log(JSON.stringify(result.ops, undefined,2));
    });

    db.close();
})