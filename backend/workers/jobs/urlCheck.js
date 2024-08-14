import addToQueue from '../queue/addToQueue.js'

const main = async ({ url }) => {
  if (!url || typeof url !== 'string') {
    throw new Error('url is required')
  }

  // Check if url is valid
  if (!url.match(/^https?:\/\//)) {
    throw new Error('url is invalid')
  }

  const queueName = 'urlCheck'

  const payload = { url }

  return addToQueue({ queueName, payload })
}

export default main
