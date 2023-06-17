// 单元测试用来测试函数的输出是否符合预期，集成测试用来测试后端的返回是否符合预期

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app) // 创建了supertest实例，叫做api
const Note = require('../models/note')
const helper = require('../tests/test_helper')

// 这里注意insertMany和save方法的区别：insertMany不会触发中间
// 件，不会触发schema的验证
// 此外，beforeEach是jest提供的钩子函数，在每个测试用例运行之前
// 都会执行该函数
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObject = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObject.map(note => note.save())
  await Promise.all(promiseArray)
})

// 1 测试 get all 接口
test('notes are returned as json', async () => {
  await api  // supertest使用Promises，所以支持链式调用多个断言
    .get('/api/notes')  // 
    .expect(200)
    .expect('Content-Type', /application\/json/)  // 第二个参数是一个正则表达式
  // 左右两个斜杠之间的部分是正则表达式的模式，即 application\/json
}, 100000) // test函数的第三个函数将超时设为10万毫秒

// 2
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(helper.initialNotes.length)
})

// 3
test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(item => item.content) // 返回一个数组
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})

// 4 测试post接口
test('a valid note can be added', async () => {
  const newNote = {  // 定义一个对象，存入新的笔记
    content: 'async/await simplifies making async calls',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)  // 将newNote通过post方法发送给要测试的接口
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  // console.log('2', notesAtEnd)
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(item => item.content)
  expect(contents).toContain('async/await simplifies making async calls')
})

// 5
test('note without content is not added', async () => {
  const newNote = {}

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length)
})

// 6 获取单条笔记
// 思路：先通过help模块读取数据库现有的数据，取出其中的一个，然后调用待测试的api，通过传入
// 刚才这条数据的id，获得返回值. 看是否返回成功，返回值类型是否符合预期
test('a specified note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
  expect(resultNote.body).toEqual(processedNoteToView)
})

// 7 删除一条note
// 具体步骤：
// 1. 通过自己写的helper逻辑初始化数据库中的数据
// 2. 将第一条数据设为删除测试的目标数据
// 3. 调用待测的api，测试其是否返回204
// 4. 测试删除以后的数据库内的数据的数量是否等于初始数量-1
// 5. 测试删除以后的数据库内的数据，是否包含已删除掉的数据
test('a note can be deleted', async () => {
  const noteStart = await helper.notesInDb()
  const noteToDelete = noteStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

  const contents = notesAtEnd.map(item => item.content)
  expect(contents).not.toContain(noteToDelete.content)
})

afterAll(() => {  // afterAll函数是一个钩子函数
  mongoose.connection.close()
})