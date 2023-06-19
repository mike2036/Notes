// 定义 User 模型
const mongoose = require('mongoose')

// 定义用户模式
const userSchema = new mongoose.Schema({ // 使用mongoose.Schema创建一个模式对象
  username: String, // 指定这个模式中各字段的类型
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'  // 指定了关联的模型名称为Note

    }
  ]
})

// 自定义toJSON方法，已确保返回的JSON对象不包含敏感信息
userSchema.set('toJSON', {  // 设置userSchema模式的选项
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // 不应该显示passwordHash
    delete returnedObject.passwordHash
  }
})

// 创建一个名为User的模型
const User = mongoose.model('User', userSchema)

module.exports = User