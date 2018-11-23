var mongoose = require('mongoose');
var User = mongoose.model('User',{
    name:{
        type:String,
        required:true,
        minlength:5
    },
    email:{
        type:String,
        trim:true
    }
});
module.exports = {User}