const {ObjectID} = require('mongodb');
const expect = require('expect');
const request = require('supertest');
const {Todo} = require('./../models/todo');
const {app} = require('./../server');

const todos = [{
    _id: new ObjectID,
    text:'First test todo'
},{
    _id: new ObjectID,
    text:'Second test todo'
}]
beforeEach((done)=>{
    Todo.deleteMany({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=> done());  
});
/** beforeEach() will be called before every test case */
// describe('POST /Todos',()=>{
//     it('should create a new todo',(done)=>{
//         var text = 'Test todo';
//         request(app)
//             .post('/todos')
//             .send({text})
//             .expect(200)
//             .expect((res)=>{
//                 expect(res.body.text).toBe(text);
//             })
//             .end((err,res)=>{
//                 if(err){
//                     return done(err);
//                 }
//                 Todo.find().then((todos)=>{
//                     expect(todos.length).toBe(4);
//                     expect(todos[0].text).toBe(text);
//                     done();
//             }).catch((e)=> done(e));
//         });
//     });
// });

describe('GET/todos/id',() => {
    it('should return an individual doc',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return 404 if todo not found',(done)=>{
        var id = new ObjectID;
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids',(done)=>{
        request(app)
            .get(`/todos/1234`)
            .expect(404)
            .end(done);
    });
});

// describe('GET/todos',()=>{
//     it('should get all todos',(done)=>{
//         request(app)
//             .get('/todos')
//             .expect(200)
//             .expect((res)=>{
//                 // expect(res.body.todos.length).toBe(6);
//                 console.log(res.body.todos.length);
//             })
//             .end(done);
//     });
// });