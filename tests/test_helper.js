// 从note模块中导入Note对象，note模块完成了noteSchema的定义、根
// 据noteSchema创建了Note模型对象，最后导出Note
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]

const notesInDb = async () => {
  const content = await Note.find({})
  // console.log('1', content)
  return content.map(item => item.toJSON()) // toJSON方法把模型对象转换成JSON格式的普通js对象
  // 当你从数据库中检索到一个 Mongoose 模型对象时，它包含了很多 Mongoose 特定的属性和方法，通过调用 
  // toJSON() 方法，你可以将其转换为普通的 JSON 对象，只保留原始数据和自定义字段，而过滤掉 Mongoose 
  // 特有的属性
}

const nonExistingId = async () => {
  const note = new Note({
    content: 'will remove this soon',
    data: new Date()
  })
  await note.save()
  const id = note._id.toString()
  await note.remove()
  return id
}

module.exports = {
  initialNotes, notesInDb, nonExistingId
}
