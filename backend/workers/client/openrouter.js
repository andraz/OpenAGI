import OpenAI from 'openai'

import dotenv from 'dotenv'
dotenv.config()

import { useOpenRouterKey } from './pg.js'

// Create a new client instance
const getClient = async () => {
  console.time('getOpenRouterKey')
  const key = await useOpenRouterKey()
  console.timeEnd('getOpenRouterKey')

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    // apiKey: process.env.OPENROUTER_API_KEY,
    apiKey: key,
  })
}

export default getClient
