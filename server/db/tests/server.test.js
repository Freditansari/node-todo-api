const expect = require('expect');
const request = require('supertest');

const {app} = require('./../../server');
const {Todo} = require('../models/todo');

//this function is to clear the todo collections before each test cycle
beforeEach((done)=>{
    Todo.remove({}).then(()=>done())
});

describe('Post /todos',()=>{
    it('shoule create new todo', (done)=>{
        var text = 'this is from a test server';

        request(app).post('/todos')
        .send({text})
        .expect(200)
        .expect((response)=>{
            expect(response.body.text)
            .toBe(text)
        }).end((err, response)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        });

    });

    it('shoudl not create to do invalid body', (done)=>{


        request(app).post('/todos')
        .send({})
        .expect(400)
        .end((err, response)=>{
            if(err){
                return done(err);
            }
            Todo.find().then((todos)=>{
                            expect(todos.length).toBe(0);
                            done();
                        }).catch((e)=>done(e));

        });

    });

});