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
    // db.collection('Todos').insertOne({
    //     text:'Something to do',
    //     completed:false
    // },(err,result)=>{
    //     if(err){
    //         return console.log('unable to insert Todos',err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });
    // db.collection('Users').insertOne({
    //     name:'Rishabh',
    //     age:21,
    //     location:'Amritsar'
    // }, (err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert Users',err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });
    client.close();
});
