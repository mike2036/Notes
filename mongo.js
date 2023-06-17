const mongoose = require('mongoose')

// 将用户在终端输入的命令 的第3个参数（2+1） 赋值给password，这实际上是用户提供的密码
const password = process.argv[2]

if (!password) {
  console.log('Please provide the password as argument: node mongo.js <password>')
  process.exit(1)
}

const url =
  `mongodb+srv://fullstack:${encodeURIComponent(password)}@cluster0.rmfowhr.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)
console.log('Connected to MongoDB.')


// 定义一个模式，叫做noteSchema，它描述了笔记的结构
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

// mongoose.model将模式转换为模型，并将其命名为Notes。模型的本质是构造函数
const Note = mongoose.model('notes', noteSchema)

// // 新建3个Note实例
// const note1 = new Note({
//   content: "HTML is easy",
//   date: "2023-05-30T17:30:31.098Z",
//   important: true
// })
// const note2 = new Note({
//   content: "Browser can execute only Javascript",
//   date: "2023-05-31T18:39:34.091Z",
//   important: false
// })
// const note3 = new Note({
//   content: "GET and POST are the most important methods of HTTP protocol",
//   date: "2023-06-10T19:20:14.298Z",
//   important: true
// })

const notes = [
  {
    content: "HTML is easy",
    date: "2023-05-30T17:30:31.098Z",
    important: true
  },
  {
    content: "Browser can execute only Javascript",
    date: "2023-05-31T18:39:34.091Z",
    important: false
  },
  {
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2023-06-10T19:20:14.298Z",
    important: true
  }]


mongoose.connection.on('open', async () => {
  await Note.insertMany(notes)
  console.log('Data saved successfully!')
  mongoose.connection.close()
})

