const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');

var id = '5bf7e179bb59d72b803b0a2a';

if(!ObjectID.isValid(id)){
    return console.log('ID is not valid');
}

Todo.find({
    _id:id
}).then((todo)=>{
    console.log(todo);
},(e)=>{
    console.log(e);
});

Todo.findOne({
    _id:id
}).then((todo)=>{       /** This function will return null if record not found */
    console.log(todo);
},(e)=>{
    console.log(e);
});

Todo.findById(id).then((todo)=>{
    console.log(todo);
},(e)=>{        /** This function will return null if record not found */
    console.log(e);
});