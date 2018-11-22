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
    /** find() give us a pointer or a cursor to docs inside a collection
     * we can use toArray() to get docs in array 
     * and this will return a Promise (toArray())
     */
    
    // db.collection('Todos').find({completed:false}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     /** for filtering we can pass our query inside find(query=>{key : value}) */
    //         console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //     console.log('unable to fetch data ',err);
    // });
    
    // db.collection('Todos').find().count().then((count)=>{
    //     console.log(`Todos count: ${count}`);
    // },(err)=>{
    //     console.log('Unable to count the Todos ',err);
    // });

    db.collection('Users').find({name:'Rishabh'}).toArray().then((user)=>{
        console.log('Users:');
        console.log(JSON.stringify(user, undefined, 2));
    },(err)=>{
        console.log('Unable to fetch user',err);
    });
    db.collection('Users').find({name:'Rishabh'}).count().then((user)=>{
        console.log(`Users count: ${user}`);
    },(err)=>{
        console.log('Unable to fetch user',err);
    });
    client.close();
});