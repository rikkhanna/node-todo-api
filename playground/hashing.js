const {SHA256} = require('crypto-js');
const jwt   = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash('rishabh',salt,(err,hash)=>{
//         console.log(hash);
//     });
// });
bcrypt.compare('rishabh','$2a$10$oQTd/fVq.KEor7yWBuYnP.BxdBwDv.PBNPs6tkMkun4feyc1DG/Ju',(err,res)=>{
    console.log(res);
})
// var data = {
//     id:10
// }
// var token = jwt.sign(data,'some secret');
// console.log(token);
// var decode = jwt.verify(token,'some secret');
// console.log('decode',decode);




/*
var message = 'Rishabh khanna';
var hash    = SHA256(message).toString();

console.log('message',message);
console.log('hash',hash);

const data = {
    id:4
}
const token = {
    data,
    hash: SHA256(JSON.stringify(data)+'some secret').toString()
}

const resultToken = SHA256(JSON.stringify(token.data)+'some secret').toString();
if(resultToken === token.hash){
    console.log('data was not changed')
}else{
    console.log('data was changed');
}
*/