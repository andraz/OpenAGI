import { createAllWorkers } from './createWorker.js'
import logger from './utils/logger.js'

// Create all workers
createAllWorkers()

process.on('uncaughtException', err => {
  logger.error('Uncaught Exception', err)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise })
})
