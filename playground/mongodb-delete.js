 // const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');
/** This MongoClient let you connect to mongodb by calling */

/** This connect method takes two arguments 
 * First argument is string , this is going to be a URL (AWS, Heroku or in our case localhost)
*/
var url = 'mongodb://localhost:27017/';
var dbName  = 'TodoApp';

MongoClient.connect(`${url}${dbName}`,(err,client)=>{
    if(err){
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');
    const db = client.db(dbName);
    /*  code to delete  one document from collection
    db.collection('Todos').deleteOne({_id:new ObjectID('5bf59c9990a9b4274489b273')}).then((result)=>{
        console.log(result);
    }); */

    /*  Find and Delete an item 
    db.collection('Todos').findOneAndDelete({_id:new ObjectID('5bf59c87a8e81c2998b8bf3d')}).then((result)=>{
        console.log(result);
    }); */

    /** Delete items in bulk using deleteMany() */

    db.collection('Todos').deleteMany({text:'Something to do'}).then((result)=>{
        console.log(result);
    });
    client.close();
});