import { Client } from '@gradio/client'

import dotenv from 'dotenv'
dotenv.config()

const spaceId = process.env.HUGGING_FACE_SPACE_ID

// Create a new client instance
const getClient = async () => Client.connect(spaceId)

export default getClient
