const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)



// 拼接数据库url
const url = `mongodb+srv://${config.dbUser}:${config.dbPass}@${config.dbUri}`


// 开始连接数据库
logger.info('connecting to mongoDB')
mongoose.connect(url)
  .then((result) => {
    logger.info('Connected to MongoDB.')
  })
  .catch(err => {
    logger.error('error to connecting to MongoDB:' + err.message)
  })

// 加载中间件，中间件的先后顺序很重要
app.use(cors()) // 1.使用cors中间件，以允许跨域请求
app.use(express.static('build')) // 当http服务器接收到get请求，优先去build
// 文件夹中寻找是否存在同名路径，如有，则直接响应。
app.use(express.json()) // 2.使用express json-parser解析器，用来将json字符串转化为js对象
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)


// 在路由的后面加载剩下的中间件
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app 
