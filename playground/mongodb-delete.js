const {MongoClient, ObjectID} = require('mongodb');
/**
 * HOW TO DELETE IN MONGODB
 */

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err){
        return console.log('unable to connect to mongodb');
    }
    console.log('connected to mongodb ');
    //DELETE MANY
    // db.collection('Todos').deleteMany({text: "is it in yet? "}).then((result)=>{
    //     console.log(result);
    // });

  //DELETE ONE
    // db.collection('Todos').deleteOne({text: "is it in yet? "}).then((result)=>{
    //     console.log(result);
    // });

    //FINDONE AND DELETE
    // db.collection('Todos').findOneAndDelete({completed: true}).then((result)=>{
    //     console.log(result);
    // });

      db.collection('Todos').deleteOne({_id: new ObjectID("5bd9616dfa1beb6c5f321054")}).then((result)=>{
        console.log(result);
    });
   



    db.close();
})