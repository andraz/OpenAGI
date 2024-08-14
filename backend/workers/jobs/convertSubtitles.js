import addToQueue from '../queue/addToQueue.js'

const convertSubtitles = async videoId => {
  if (!videoId) {
    throw new Error('videoId is required')
  }

  const jobData = { videoId }

  return addToQueue('convertSubtitles', jobData)
}

export default convertSubtitles
