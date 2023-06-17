const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length  // reducer函数的第二个参数是累计变量的初始值
}

module.exports = {
  reverse, average
}