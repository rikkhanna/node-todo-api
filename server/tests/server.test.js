const {ObjectID} = require('mongodb');
const expect = require('expect');
const request = require('supertest');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {app} = require('./../server');
const {todos,populateTodos} = require('./seed/seed');
const {users,populateUsers} = require('./seed/seed');
/** beforeEach() will be called before every test case */
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /users/login',() => {
    it('should login user and return auth token',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password:users[1].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toInclude({
                        access:'auth',
                        token:res.headers['x-auth']
                    });
                    done();
                }).catch((e)=> done(e));
            });
    });

    it('should reject invalid login ',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password:users[1].password + '1'
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toInclude({
                        access:'auth',
                        token:res.headers['x-auth']
                    });
                    done();
                }).catch((e)=> done(e));
            });
    });
});

describe('GET /users/me',() => {
    it('should return user if authenticated',(done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id);
                expect(res.body.email).toBe(user[0].email);
            })
            .end(done);
    });
    it('should get 401 if user is not authenticated',(done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users',()=>{
    it('should create a new user',(done) => {

        var email = 'rishabh@example.com';
        var password = '123abc';
        request('app')
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
            })

    });
    it('should return validation errors if request invalid',(done)=>{
        request('app')
            .post('/users')
            .send({email:'ris',password:'12'})
            .expect(400)
            .end(done);
    });

    it('should not create user if email is already in use',(done)=>{
        request('app')
            .post('/users')
            .send({email:users[0].email})
            .expect(400)
            .end(done);
    })
});


/*
describe('POST /Todos',()=>{
    it('should create a new todo',(done)=>{
        var text = 'Test todo';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    expect(todos[0].text).toBe(text);
                    done();
            }).catch((e)=> done(e));
        });
    });
});
*/

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

/** testing delete todos */

describe('DELETE/todos/:id',()=>{
    it('should remove a todo',(done)=>{
        var id = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(id);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.findById(id).then((todo)=>{
                    expect(todo).toNotExist()
                    done();
                }).catch((e)=> done(e));
            });
    });
    it('should return 404 if todo not found',(done)=>{
        var id = new ObjectID;
        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 if non-objectID',(done)=>{
        request(app)
            .delete(`/todos/1234`)
            .expect(404)
            .end(done);
    })
});

/** Testing for Patch */

describe('PATCH/todos/:id',()=>{
    it('should update a todo',(done)=>{
        var id = todos[1]._id.toHexString();
        var text = 'updated test todo';
            
        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({
                text,
                completed:true
            })
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed',(done)=>{
        var id = todos[0]._id.toHexString();
        var text = 'updated test todo 2';
            
        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({
                text,
                completed:false
            })
            .expect((res)=>{
                expect(res.body.todo.completedAt).toNotExist();
                expect(res.body.todo.text).toNotBe(todos[0].text);
                expect(res.body.todo.completed).toBe(false);
            })
            .end(done);
    });
});


describe('/users/me/token',() => {
    it('should remove auth token on logout',(done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }

                User.findById(users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=> done(e));
            })
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