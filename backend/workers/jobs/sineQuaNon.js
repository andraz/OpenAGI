import addToQueue from '../queue/addToQueue.js'

/**
 * Generates a list of preconditions needed to a achieve a specific result.
 *
 * @param {Object} options - The options for the transformation.
 * @param {string} options.endResult - The description of the end result.
 * @returns {Promise<string>} - A promise that resolves to the job ID.
 * @throws {Error} - If the end result description is not provided.
 */
const main = async ({ endResult }) => {
  if (!endResult || typeof endResult !== 'string') {
    throw new Error('Description of the end result is required')
  }

  const queueName = 'sineQuaNon'

  const payload = { endResult }

  return addToQueue({ queueName, payload })
}

export default main
