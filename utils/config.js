require('dotenv').config()

const serverPort = process.env.SERVER_PORT

const dbUri = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const dbUser = process.env.DB_USER
const dbPass = encodeURIComponent(process.env.DB_PASS)

module.exports = {
  dbUri, dbUser, dbPass, serverPort
}

