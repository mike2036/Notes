const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('../tests/test_helper')

describe('when there is initially onw user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('abc123', 10)
    const user = new User({
      username: 'test_username01',
      passwordHash
    })
    await user.save()
  })

  test('creation succeeds with a new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'sink',
      name: 'Lincoln',
      password: 'abcd1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'sink',
      name: 'Lincoln',
      password: 'abcd1234',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username has been taken, choose another one')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})