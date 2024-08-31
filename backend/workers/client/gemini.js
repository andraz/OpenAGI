import dotenv from 'dotenv'
dotenv.config({ path: '../.env', debug: true })

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  //   model: 'gemini-1.5-pro-exp-0801',
})

const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: {
    type: 'object',
    description: 'Return a list of recipes',
    properties: {
      recipes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            recipe_name: {
              type: 'string',
              description: 'name of the recipe',
            },
            // Add more recipe properties here if needed
          },
        },
      },
    },
  },
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
]

async function getRecipes(foodItem) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate a list of ${foodItem} recipes. Make the outputs in JSON format.`,
            },
          ],
        },
      ],
    })

    const result = await chatSession.sendMessage('give me the recipes')
    return JSON.parse(result.response.text())
  } catch (error) {
    console.error('Error generating recipes:', error)
    return { error: 'Failed to generate recipes.' }
  }
}

// Example usage:
getRecipes('cookie')
  .then(recipes => console.log(recipes))
  .catch(error => console.error(error))
