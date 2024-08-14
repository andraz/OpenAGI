import getGroqClient from '../client/groq.js'
import { jsonrepair } from 'jsonrepair'

/**
 * Ingests a string of data which needs to be converted to an array of JSON objects.
 * @param {Object} job - The job object containing the data to be processed.
 * @param {Object} job.data - The data object containing the input text and JSON array keys.
 * @param {string} job.data.inputText - The text to be converted to JSON.
 * @param {string} job.data.jsonArrayKeys - Description of keys for each JSON object in the array.
 * @returns {Object|Array} The repaired JSON object or an array of JSON objects.
 * @throws {Error} Throws an error if there is an issue with the main function.
 */

const main = async job => {
  try {
    const { inputText, jsonArrayKeys } = job.data

    const groq = getGroqClient()

    console.time('chatCompletion')

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'reply only with valid JSON, do not write any other text before',
        },

        // Pass the text to be converted to JSON
        {
          role: 'user',
          content: inputText,
        },

        // Preempt the response of assistant as if it already wrote this text and opened JSON markdown block
        {
          role: 'assistant',
          content: [
            'Sure I can rewrite your text as JSON array of objects where each has keys: ',
            jsonArrayKeys + '. Here is the JSON: ```json\n[',
          ].join(''),
        },
      ],
      // model: 'llama-3.1-8b-instant',
      // model: 'llama3-groq-8b-8192-tool-use-preview',
      // model: 'gemma-7b-it',
      model: 'llama3-8b-8192',
      temperature: 0,

      max_tokens: 8000,
      top_p: 1,
      stream: false,

      // Assume output is complete when json markdown block or array ends
      stop: ['```', ']'],
    })

    console.timeEnd('chatCompletion')

    const jsonResponse = chatCompletion.choices[0]?.message?.content || ''

    const jsonResponseWithBrackets = '[' + jsonResponse + ']'

    console.log('jsonResponseWithBrackets:', jsonResponseWithBrackets)

    let repairedJson

    // Attempt to convert the response to valid JSON
    try {
      repairedJson = JSON.parse(jsonrepair(jsonResponseWithBrackets))
    } catch (err) {
      repairedJson = { failed: true, raw: jsonResponse, error: err.message }
    }

    return repairedJson
  } catch (error) {
    console.error('Error in main:', error)
    throw error
  }
}

export default main
