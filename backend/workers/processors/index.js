import path from 'path'
import fs from 'fs'
import { URL } from 'url'

// Define a function that takes a queue name and a processor file as arguments
export const getProcessorFile = (queueName, processorFile) => {
  // If a processor file is provided, return it
  if (processorFile) {
    return processorFile
  }

  // If no processor file is provided, construct a default path based on the queue name
  const currentDir = path.dirname(new URL(import.meta.url).pathname)
  const defaultPath = path.join(currentDir, queueName + '.js')

  // If a file exists at the default path, return the default path
  if (fs.existsSync(defaultPath)) {
    return defaultPath
  }

  // If no processor file is provided and no file is found at the default path, throw an error
  throw new Error(`Processor file not found for queue: ${queueName}`)
}
