const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');

var id = '5bf826a975d2fe2328672eb3';

if(!ObjectID.isValid(id)){
    return console.log('ID is not valid');
}

Todo.remove({}).then((result)=>{
    console.log(result);
})

// Todo.findOneAndRemove({_id:id}).then((todo)=>{
//     console.log(todo);
// });

// Todo.findByIdAndRemove(id).then((todo)=>{
//     console.log(todo);
// });