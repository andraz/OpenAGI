import addToQueue from '../queue/addToQueue.js'

const convertSubtitles = async url => {
  if (!url || typeof url !== 'string') {
    throw new Error('url is required')
  }

  // Check if url is valid
  if (!url.match(/^https?:\/\//)) {
    throw new Error('url is invalid')
  }

  const jobData = { url }

  return addToQueue('urlCheck', jobData)
}

export default convertSubtitles
