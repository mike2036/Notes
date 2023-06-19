const mongoose = require('mongoose')

// 定义数据结构，叫做noteSchema，包括字段名称、类型、验证规则等，这是mongoose提供的功能
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// 修改模式的toJSON方法，其中document表示文档数据库对象
// 这里使用set方法修改noteSchema的toSON方法
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// model是由schema创建的实体，这也是mongoose提供的概念，它是操作数据库的对象
// Note指的是创建的实体，notes指的是数据库中的一个集合collection，名称为notes
module.exports = mongoose.model('Note', noteSchema)