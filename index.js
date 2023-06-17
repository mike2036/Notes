const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.serverPort, () => {
  const serverLaunchDate = new Date()
  logger.info(`Server running on port ${config.serverPort}`)
})
