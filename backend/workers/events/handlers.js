import logger from '../utils/logger.js'

export const onActiveHandler = job => {
  logger.info(`[Worker] active: ${job.id} in queue ${job.queue.name}`, job.data)
}

export const onProgressHandler = (job, progress) => {
  logger.info(`[Worker] progress: ${job.id} in queue ${job.queue.name}`, {
    progress,
  })
}

export const onCompletedHandler = job => {
  logger.info(
    `[Worker] completed: ${job.id} in queue ${job.queue.name}`,
    job.returnvalue
  )
}

export const onFailedHandler = (job, err) => {
  logger.error(`[Worker] failed: ${job.id} in queue ${job.queue.name}`, err)
}
