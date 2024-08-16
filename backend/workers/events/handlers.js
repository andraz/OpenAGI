import logger from '../utils/logger.js'

export const onActiveHandler = job =>
  logger.info('[Worker active]', {
    id: job.id,
    name: job.name,
    data: job.data,
  })

export const onProgressHandler = (job, progress) =>
  logger.info('[Worker progress]', { jobId: job.id, progress })

export const onCompletedHandler = job => {
  logger.info('[Worker completed]', { jobId: job.id })
}

export const onFailedHandler = (job, err) => {
  logger.error('[Worker failed]', {
    jobId: job.id,
    jobName: job.name,
    err,
  })
}
