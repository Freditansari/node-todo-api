const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err){
        return console.log('unable to connect to mongodb');
    }
    console.log('connected to mongodb ');

    // /**SELECT ALL IN MONGO DB */
    db.collection('Todos').find().toArray().then((docs) =>{
        console.log('Select all**');
        console.log(JSON.stringify(docs, undefined, 2))

    },(err)=>{
        console.log(err);
    });

    /**Select query (note case sensitive) */
    db.collection('Todos').find({text: "Something to do "}).toArray().then((docs) =>{
        console.log('Select query**');
        console.log(JSON.stringify(docs, undefined, 2))

    },(err)=>{
        console.log(err);
    });

    /**select from id  */
    db.collection('Todos').find({_id: new ObjectID('5bd9616dfa1beb6c5f321054')}).toArray().then((docs) =>{
        console.log('Select from id **');
        console.log(JSON.stringify(docs, undefined, 2))

    },(err)=>{
        console.log(err);
    });

    db.collection('Todos').find().count().then((count) =>{
        console.log('count**');
        console.log(count);

    },(err)=>{
        console.log(err);
    });



    db.close();
})