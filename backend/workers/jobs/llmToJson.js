import addToQueue from '../queue/addToQueue.js'

/**
 * Transforms input text into a JSON object based on the specified method.
 *
 * @param {Object} options - The options for the transformation.
 * @param {string} options.inputText - The text to be transformed into a JSON object.
 * @param {string} options.jsonArrayKeys - A description of the JSON object's keys.
 * @param {string} options.method - The method to use for the transformation.
 * @throws {Error} If inputText, jsonArrayKeys, or an unsupported method is not provided.
 * @returns {Promise<Object>} A promise that resolves to the JSON object.
 */
const llmToJson = async ({ inputText, jsonArrayKeys, method }) => {
  if (!inputText) {
    throw new Error('inputText to be transformed is required')
  }

  if (!jsonArrayKeys) {
    throw new Error('jsonArrayKeys description is required')
  }

  if (!method || !methodToQueueName[method]) {
    throw new Error(
      `Invalid method specified. Supported methods: ${Object.keys(
        methodToQueueName
      ).join(', ')}`
    )
  }

  const jobData = {
    inputText,
    jsonArrayKeys,
  }

  // Get the correct queue name based on the method
  const queueName = methodToQueueName[method]

  return addToQueue(queueName, jobData)
}

// A mapping of method names to their respective queue names
const methodToQueueName = {
  groq: 'llmToJsonGroq',
  openrouter: 'llmToJsonOpenrouter',
  huggingFace: 'llmToJsonHuggingFace',
}

export default llmToJson
