import getGroqClient from '../client/groq.js'

/**
 *  Use a LLM to generate a list of subtasks and sine qua non conditions for generating a comprehensive
 * @param {Object} job - The job object containing the data.
 * @param {Object} job.data - The data object containing the job details.
 * @param {string} job.data.endResult - The end result of the task.
 * @returns {string} The generated list of subtasks and sine qua non conditions.
 * @throws {Error} If the endResult is not provided in the job data.
 */

const main = async job => {
  try {
    // Destructure the url from the job data
    const { endResult } = job.data

    // If the enResult is not provided, throw an error
    if (!endResult) {
      throw new Error('endResult is required in the job data')
    }

    const groq = getGroqClient()

    console.time('chatCompletion')

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: [
            'Using Hierarchical Task Analysis (HTA), break down the task user provides into its essential subtasks.',
            "For each subtask, identify the 'sine qua non' conditions - the essential requirements that must be met for the subtask to be considered successfully completed.",
            'Consider aspects like data quality, analysis techniques, and report structure.',
          ].join('\n'),
        },

        {
          role: 'user',
          content: `Give me steps needed to achieve the task: ${endResult}`,
        },

        // Preempt the response of the assistant by starting with the first step
        {
          role: 'assistant',
          content: '1. ',
        },
      ],

      model: 'llama3-8b-8192',
      temperature: 0,

      max_tokens: 8000,
      top_p: 1,
      stream: false,
    })

    console.timeEnd('chatCompletion')

    // Extract the content of the assistant's message from the chat completion response
    const assistantMessage = chatCompletion.choices[0].message.content

    // Return the generated list of subtasks and sine qua non conditions
    return assistantMessage
  } catch (error) {
    // Log any errors that occur during the execution of the command
    console.error('Error executing command:', error)

    // Rethrow the error to be handled by the caller
    throw error
  }
}
