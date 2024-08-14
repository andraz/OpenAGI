import { Queue } from 'bullmq'
import createQueue from './createQueue.js'

/**
 * Retrieves or creates a queue instance by its name.
 * @param {string|Queue} queueInput - The name of the queue or the queue instance itself.
 * @returns {Queue} The queue instance.
 * @throws {Error} Throws if the queueInput is invalid.
 */
const getQueue = queueInput => {
  if (typeof queueInput === 'string') {
    return createQueue(queueInput)
  }

  if (!(queueInput instanceof Queue)) {
    throw new Error('Invalid queue instance')
  }

  return queueInput
}

export default getQueue
