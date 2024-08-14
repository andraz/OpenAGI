import Groq from 'groq-sdk'

import dotenv from 'dotenv'
dotenv.config()

/**
 * Create a new Groq client instance.
 *
 * @param {Object} [options] - An optional configuration object.
 * @param {string} [options.apiKey] - The API key to use for the Groq client.
 *   If not provided, the function will use the value of the GROQ_API_KEY environment variable.
 * @returns {Groq} A new Groq client instance.
 */
const getClient = ({ apiKey = process.env.GROQ_API_KEY } = {}) =>
  new Groq({ apiKey })

export default getClient
