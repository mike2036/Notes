const logger = require('./logger')

// 定义requestLogger中间件
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Body:', req.body)
  console.log('---')
  next()
}

// 定义 unknownEndpoint中间件
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

// 定义 errorHandler中间件
const errorHandler = (err, req, res, next) => {
  // 在控制台输出错误消息
  console.log(err.message)

  // 处理CastError
  if (err.name === 'CastError') {
    return res.status(400).send({
      error: 'id 格式不对'
    })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message
    })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired'
    })
  }

  next()
}



module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint
}