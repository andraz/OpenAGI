import addToQueue from '../queue/addToQueue.js'

const main = async data => {
  // console.log('workers/jobs/setNodeState.js', data)

  const queueName = 'setNodeState'

  const payload = data

  return addToQueue({ queueName, payload })
}

export default main
