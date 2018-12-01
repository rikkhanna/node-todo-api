require('./config/config');
const _     = require('lodash');
var express    = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo}     = require('./models/todo');
var {User}     = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app     = express();
const port = process.env.PORT;

app.use(bodyParser.json());
/** Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.  */

app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    // var user = new User(body);
    // res.send(user);
    User.findByCredentials(body.email,body.password).then((user)=>{
        // res.send(user);
        return user.generateAuthToken().then((token) => {
            res.header('x-auth',token).send(user);
        })
    }).catch((e) => {
        res.status(400).send();
    })
})


app.post('/todos', authenticate, (req, res)=>{
    var todo1 = new Todo({
        text:req.body.text,
        _user:req.user._id
    });
    todo1.save().then((todoDoc)=>{
        res.send(todoDoc);
    },(e)=>{
        res.Status(400).send(e);
    });
});

app.get('/todos', authenticate, (req,res)=>{
    Todo.find({
        _user:req.user._id
    }).then((todo)=>{
        res.send(todo);
    },(e)=>{
        console.log(e);
    })
});

/** Getting an individual Resource GET/todo:id */
app.get('/todos/:id', authenticate, (req, res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send(`Invalid id ${id}`);
    }
    Todo.findOne({
        _id:id,
        _user:req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send(`Todo not found at this id:${id}`);
        }
        res.status(200).send({todo});
    }).catch((e)=>{
        res.status(400).send();
    })
});

/** Deleting a resource */

app.delete('/todos/:id', authenticate, (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send(`No Todo exist at this id: ${id}`);
    }
    Todo.findOneAndRemove({
        _id:id,
        _user:req.user._id
    }).then((todo)=>{
        if(!todo){
            res.status(404).send();
        }else{
            res.status(200).send({todo});
        }
    }).catch((e)=>{
        res.status(404).send();
    })

})

/** Updating a resource */

app.patch('/todos/:id', authenticate, (req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.send('Non-object id');
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt =null;
    }

    Todo.findOneAndUpdate({
        _id:id,
        _user:req.user._id
    },{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{res.status(400).send(e)});
});

/** Adding a user */

app.post('/users',(req, res)=>{

    // _.pick() will return an object

    var body = _.pick(req.body,['email','password']);
                    // User({body}) do not pass body object like this 
    var user = new User(body); // correct way

// // save() is used to save the doc into the collection

    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

/** authenticating the user using private route */

app.get('/users/me', authenticate,(req,res)=>{
    res.send(req.user);
});

/** authenticate is a middleware which will get call everytime, so for that we need to set token in request header */
app.delete('/users/me/token', authenticate, (req,res) => {
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    })
});

app.listen(port,()=>{
    console.log(`Started at port ${port}`);
})

module.exports = {app}
