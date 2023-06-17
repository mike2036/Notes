// ...params表示可以接受任意数量的参数
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

module.exports = {
  info, error
}