import addToQueue from '../queue/addToQueue.js'

const main = async props => {
  const nodeId = props.id
  const data = { position: props.position }

  const queueName = 'setNodeState'

  const payload = { nodeId, data }

  return addToQueue({ queueName, payload })
}

export default main
