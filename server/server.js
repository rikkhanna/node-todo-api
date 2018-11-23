var express    = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo}     = require('./models/todo');
var {User}     = require('./models/user');

var app     = express();
app.use(bodyParser.json());
app.post('/todos',(req, res)=>{
    var todo1 = new Todo({
        text:req.body.text
    });
    todo1.save().then((todoDoc)=>{
        res.send(todoDoc);
    },(e)=>{
        res.Status(400).send(e);
    })
})
app.listen(3000,()=>{
    console.log('Started at port 3000');
})


