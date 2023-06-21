const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// #1 处理 get all 请求
notesRouter.get('/', async (req, res) => {
  await Note.find()
    .populate('user')
    .then((notes) => {
      res.json(notes) // json方法自动调用toJSON
    })
    .catch((error) => {
      console.error('Failed to retrieve notes:', error)
      res.status(500).json({ error: 'Failed to retrieve notes' })
    })
})

// #2的辅助函数，从req中获取token
const getTokenFrom = req => {
  const authorization = req.get('Authorization') // 获取req的head中authorization字段的值
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7) // 返回从第7个字符开始到末尾的子字符串，即去掉'bearer '的部分，就是令牌
  }
  return null
}

// #2 处理 post 请求
notesRouter.post('/', async (req, res, next) => {
  const { body } = req //  从request对象的body属性中获取note数据

  // 用户鉴权
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

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
    user: user._id,
  })

  const savedNote = await note.save() // 调用note.save()方法向数据库写入note这个document

  user.notes = user.notes.concat(savedNote._id)
  await user.save()

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

  let updatedNote = null // 必须在try-catch之外声明updatedNote，否则出错以后，catch块之内如果出现updatedNote，就会报错：未定义

  // 第三个参数{new:true}，其实是一个对象，叫做options。里面的第一个属性new表
  // 示在更新完成后，是否返回更新后的文档，默认是false不返回。这里改成了true
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      note,
      {
        new: true,
        runValidators: true,
        context: 'query', // 默认情况，验证器的会更新整个文档，这里手动设定上下
        // 文为query，即仅验证本次更新的字段
      },
    )
    res.json(updatedNote)
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter