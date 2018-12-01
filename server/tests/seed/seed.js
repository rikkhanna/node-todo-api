const {ObjectID} = require('mongodb');
const jwt   = require('jsonwebtoken');
const {User} = require('./../../models/user');
const {Todo}     = require('./../../models/todo');

const userOneId = new ObjectID;
const userTwoId = new ObjectID;

const users = [{
    _id: userOneId,
    email:'rishabh@example.com',
    password:'userOnePass',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
    }]
},{
    _id: userTwoId,
    email:'rishabh2@example.com',
    password:'userTwoPass',
}];

const todos = [{
    _id: new ObjectID,
    text:'First test todo',
    _user:userOneId

},{
    _id: new ObjectID,
    text:'Second test todo',
    _user:userTwoId,
    completed:true,
    completedAt:444
}];

const populateUsers  = (done) => {
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne,userTwo]);
    }).then(()=> done);
}

const populateTodos = function(done){
    Todo.deleteMany({}).then(()=> {
         return Todo.insertMany(todos);
    }).then(()=> done);
       
};
module.exports = {todos,populateTodos, users, populateUsers};