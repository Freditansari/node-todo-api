const {MongoClient, ObjectID} = require('mongodb');
/**
 * HOW TO DELETE IN MONGODB
 */

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err){
        return console.log('unable to connect to mongodb');
    }
    console.log('connected to mongodb ');
    
    //UPDATE
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bda78db62630a2eb983cd8e')
    // },{
    //     $set:{completed:true, text: "bejono"}},{
    //         returnOriginal : false
        
    //     }).then((result)=>{
    //     console.log(result);
    // });'

    //CHECK OUT https://docs.mongodb.com/manual/reference/operator/update/ for more operators like $inc
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bda80d5039789177aad62ba')
        },{
            $set:{name: '11'},
            $inc:{age: 1}        
        },{
                returnOriginal : false
        
            }).then((result)=>{
  
            console.log(result);
        }, (updateError)=>{
                console.log(updateError);
        });

    // db.collection('Users').find({_id: new ObjectID('5bda80d5039789177aad62ba')}).toArray().then((docs) =>{
    //     console.log('Select from id **');
        
    //     let modifiedAge = docs[0].age +1;
        

   
        
        

    // },(err)=>{
    //     console.log(err);
    // });
   
    



  //DELETE ONE
    // db.collection('Todos').deleteOne({text: "is it in yet? "}).then((result)=>{
    //     console.log(result);
    // });

    //FINDONE AND DELETE
    // db.collection('Todos').findOneAndDelete({completed: true}).then((result)=>{
    //     console.log(result);
    // });

    //   db.collection('Todos').deleteOne({_id: new ObjectID("5bd9616dfa1beb6c5f321054")}).then((result)=>{
    //     console.log(result);
    // });
   



    db.close();
})