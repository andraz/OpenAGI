import getQueue from './getQueue.js'
import jobConfig from '../config/job.js'

/**
 * Adds a job to the specified queue.
 * @param {string} queueName - The name of the queue.
 * @param {object} payload - The job data to be added to the queue.
 * @param {object} [customConfig] - Optional custom job configuration.
 * @returns {Promise} Resolves when the job has been successfully added to the queue.
 * @throws {Error} Throws if adding to the queue fails.
 */
const addToQueue = async ({ queueName, payload, customConfig = {} } = {}) => {
  try {
    // Check if the queueName is provided. If not, throw an error.
    if (!queueName || typeof queueName !== 'string') {
      throw new Error('Queue name string is required')
    }

    // Get the queue using the getQueue function and the provided queueName.
    const queue = getQueue(queueName)

    // Merge the jobConfig with the customConfig to create the final job configuration.
    const config = { ...jobConfig, ...customConfig }

    // Add the job to the queue using the queue.add method and return the promise.
    return await queue.add(queueName, payload, config)
  } catch (error) {
    // If an error occurs, log the error message and throw the error.
    console.error(`Failed to add job to queue "${queueName}":`, error)
    throw error
  }
}

// Export the addToQueue function as the default export.
export default addToQueue
