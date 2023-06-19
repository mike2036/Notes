// 定义 usersRouter 路由处理器
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router() // 用于创建模块化、可挂在的路由处理器
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  console.log('getting GET request')
  const users = await User
    .find({})
    .populate('notes', { content: 1, data: 1 }) // 自动填充notes字段，内容为对应的notes文档

  res.status(200).json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({
      error: 'username has been taken, change another one.'
    })
  }

  const saltRounds = 10 // 该参数决定了hash算法的复杂性和计算成本
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save() // save()返回一个Promise对象，当Promise解析成功时，它将返回已保存的用户对象

  res.status(201).json(savedUser)
})

module.exports = usersRouter  
