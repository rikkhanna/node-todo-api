 const {MongoClient,ObjectID} = require('mongodb');
 var url = 'mongodb://localhost:27017/';
 var dbName  = 'TodoApp';
 MongoClient.connect(`${url}${dbName}`,(err,client)=>{
     if(err){
         return console.log('Unable to connect to mongodb server');
     }
     console.log('Connected to mongodb server');
     const db = client.db(dbName);
    //  db.collection('Users').findOneAndUpdate(
    //      {_id: new ObjectID('5bf59c87a8e81c2998b8bf3e')},
    //      {$set:{
    //          location:'Noida'
    //      }},
    //      {
    //          returnOriginal:false
    //      }).then((result)=>{
    //          console.log(result);
    //      });
    db.collection('Users').findOneAndUpdate(
        {_id: new ObjectID('5bf59c87a8e81c2998b8bf3e')},
        {$inc:{
            age:1
        }},
        {
            returnOriginal:false
        }).then((result)=>{
            console.log(result);
        });
     client.close();
 });