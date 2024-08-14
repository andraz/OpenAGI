import { Queue } from 'bullmq'
import redisConnectionOptions from '../config/redis.js'

/**
 * Creates a new queue instance with the provided name and the default Redis connection.
 * @param {string} name - The name of the queue to be created.
 * @param {object} [options={}] - Optional additional queue options.
 * @returns {Queue} The newly created queue instance.
 */
const createQueue = (name, options = {}) => {
  return new Queue(name, {
    connection: redisConnectionOptions,
    ...options,
  })
}

export default createQueue
