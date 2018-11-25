require('./config/config');
const _     = require('lodash');
var express    = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo}     = require('./models/todo');
var {User}     = require('./models/user');

var app     = express();
const port = process.env.PORT;
app.use(bodyParser.json());
/** Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.  */
app.post('/todos',(req, res)=>{
    var todo1 = new Todo({
        text:req.body.text
    });
    todo1.save().then((todoDoc)=>{
        res.send(todoDoc);
    },(e)=>{
        res.Status(400).send(e);
    });
});
app.get('/todos',(req,res)=>{
    Todo.find().then((todo)=>{
        res.send(todo);
    },(e)=>{
        console.log(e);
    })
});

/** Getting an individual Resource GET/todo:id */
app.get('/todos/:id',(req, res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send(`Invalid id ${id}`);
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send(`Todo not found at this id:${id}`);
        }
        res.status(200).send({todo});
    }).catch((e)=>{
        res.status(400).send();
    })
});

/** Deleting a resource */

app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send(`No Todo exist at this id: ${id}`);
    }

    Todo.findByIdAndDelete(id).then((todo)=>{
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

app.patch('/todos/:id',(req,res)=>{
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

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{res.status(400).send(e)});
});

app.listen(port,()=>{
    console.log(`Started at port ${port}`);
})

module.exports = {app}
