const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { response } = require('express')
const jwt = require('jsonwebtoken')


loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  console.log('pwd:', password)

  // 由于用户只有一个，所应该用findOne方法来查询，因为它返
  // 回满足查询条件的第一个文档对象，而findById会遍历所有文档
  const user = await User.findOne({ username }) // user是一个文档对象
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  // console.log('pwdHash in DB: ', user.passwordHash)
  console.log('is provided pwd correct? ', Boolean(passwordCorrect))
  console.log('user boolean:', Boolean(user))
  console.log('pwd boolean:', Boolean(passwordCorrect))

  console.log('calculated result:', Boolean(!(user && passwordCorrect)))

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ // 401 means unauthorized
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // 用来生成token的源信息里面只包含用户名和用户id，没有密码
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }  //jwt.sign()的第三个参数指定有效期
  )

  res
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name,
    })
})

module.exports = loginRouter