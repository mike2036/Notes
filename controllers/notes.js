const notesRouter = require('express').Router()
// 导入note模块
const Note = require('../models/note')

// #1 处理 get all 请求
notesRouter.get('/', async (req, res) => {
  await Note.find()
    .then((notes) => {
      res.json(notes) // json方法自动调用toJSON
    })
    .catch((error) => {
      console.error('Failed to retrieve notes:', error)
      res.status(500).json({ error: 'Failed to retrieve notes' })
    })
})

// #2 处理 post 请求
notesRouter.post('/', async (req, res) => {
  const { body } = req //  从request对象的body属性中获取note数据

  // 如果请求的body为空，则返回400 bad request: content missing
  if (!body.content) {
    return res.status(400).json({
      error: 'content missing.',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save() // 调用note.save()方法向数据库写入note这个document
  res.status(201).json(savedNote)
})


// #3 处理 get by id 请求
notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (note) {
    res.json(note)
  } else {
    console.log('note not found')
    res.status(404).end()
  }
})

// #4 处理 delete 请求
notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

// #5 处理 put 请求
notesRouter.put('/:id', async (req, res, next) => {
  const { body } = req

  const note = {
    content: body.content,
    important: body.important,
  }

  // 第三个参数{new:true}，其实是一个对象，叫做options。里面的第一个属性new表
  // 示在更新完成后，是否返回更新后的文档，默认是false不返回。这里改成了true
  await Note.findByIdAndUpdate(
    req.params.id,
    note,
    {
      new: true,
      runValidators: true,
      context: 'query', // 默认情况，验证器的会更新整个文档，这里手动设定上下
      // 文为query，即仅验证本次更新的字段
    },
  )
    .then((updatedNote) => {
      res.json(updatedNote)
    })
    .catch((err) => next(err))
})

module.exports = notesRouter