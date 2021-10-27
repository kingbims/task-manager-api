const request = require('supertest')
require('dotenv').config()
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne, userTwo, userTwoId, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)


test('Should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should get all tasks for userOne', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)
})

test('UserTwo should not delete taskOne', async () => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should not create task with invalid description/completed', async () => {
    await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: null
    })
    .expect(400)
})

test('Should not create task with invalid description/completed', async () => {
    await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        completed: 22
    })
    .expect(400)
})

test('Should not update other users task', async () => {
    await request(app)
    .patch(`/tasks/${userOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
        description: "I'm tired"
    })
    .expect(404)
})

test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
    .get('/tasks')
    .send()
    .expect(401)
})

test('Should fetch only completed tasks', async () => {
    await request(app)
    .get('/tasks?completed=true')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should fetch only completed tasks', async () => {
    await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should sort tasks by createdAt', async () => {
    await request(app)
    .get('/tasks?sortBy=createdAt:asc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should sort tasks by updatedAt', async () => {
    await request(app)
    .get('/tasks?sortBy=createdAt:desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should sort tasks by completed', async () => {
    await request(app)
    .get('/tasks?sortBy=completed:desc')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})


test('Should fetch page of tasks', async () => {
    await request(app)
    .get('/tasks?limit=2&skip=2')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})