import { Worker } from 'bullmq'

import config from './config/index.js'

import {
  onActiveHandler,
  onProgressHandler,
  onCompletedHandler,
  onFailedHandler,
} from './events/handlers.js'

import { getProcessorFile } from './processors/index.js'

import workerList from './workerList.js'

/**
 * Creates a new worker for a given queue and processor file.
 *
 * @param {string} queueName - The name of the queue for the worker.
 * @returns {Worker} - The created worker instance.
 */
export const createWorker = async queueName => {
  // Get the processor file for the given queue and processor file
  const processor = await getProcessorFile(queueName)

  console.log(`Creating worker for ${queueName}`)

  // Create a new worker instance with the given queue name, processor, and configuration settings
  const worker = new Worker(queueName, processor, config.worker)

  // Attach event handlers to the worker instance for the 'active', 'progress', 'completed', and 'failed' events
  worker.on('active', onActiveHandler)
  worker.on('progress', onProgressHandler)
  worker.on('completed', onCompletedHandler)
  worker.on('failed', onFailedHandler)

  // Return the worker instance
  return worker
}

/**
 * Creates and initializes all workers based on a list of job types.
 * @param {Array} [jobTypes=workerList] - Array of job types to create workers for.
 */
export const createAllWorkers = (jobTypes = workerList) => {
  // Loop through the list of job types and create a new worker for each one
  jobTypes.forEach(jobType => createWorker(jobType))
}
