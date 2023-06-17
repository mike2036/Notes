const logger = require('./logger')

// 定义requestLogger中间件
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Body:', req.body)
  console.log('---')
  next()
}

// 定义 errorHandler中间件
const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  // 处理CastError
  if (err.name === 'CastError') { // 处理 CastError 错误·
    return res.status(400).send({ error: 'id 格式不对' })
  } else if (err.name === 'ValidationError') {  // 处理 ValidationError 错误
    return res.status(400).json({ error: err.message })
  }

  next()
}

// 定义 unknownEndpoint中间件
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint
}