const express = require('express')
const { createBullBoard } = require('@bull-board/api')
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter')
const { ExpressAdapter } = require('@bull-board/express')
const http = require('http')
const { Server } = require('socket.io')
const { QueueEvents } = require('bullmq')

const main = async () => {
  const app = express()
  const server = http.createServer(app)
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  })
  const port = 7777

  // Import the workerList from the workers dir
  const workerList = (await import('./workers/workerList.js')).default

  // Import the default export from the workers/queue/getQueue.js file
  const getQueue = (await import('./workers/queue/getQueue.js')).default

  // Import jobs
  const jobs = {
    urlCheck: (await import('./workers/jobs/urlCheck.js')).default,
    sineQuaNon: (await import('./workers/jobs/sineQuaNon.js')).default,
    setNodeState: (await import('./workers/jobs/setNodeState.js')).default,
  }

  // Create an array of BullMQAdapter instances for each worker in the workerList
  const bullQueues = workerList.map(
    worker => new BullMQAdapter(getQueue(worker))
  )
  const serverAdapter = new ExpressAdapter()
  createBullBoard({ queues: bullQueues, serverAdapter })
  serverAdapter.setBasePath('/')
  app.use('/', serverAdapter.getRouter())

  // Get a handle on setNodeState queue events
  const setNodeStateQueueEvents = new QueueEvents('setNodeState')

  const getNodeById = (await import('./getNodeById.cjs')).default

  // Listen for 'completed' event on setNodeState queue
  setNodeStateQueueEvents.on('completed', async ({ returnvalue }) => {
    // Fetch the updated node data from PostgreSQL
    const data = await getNodeById(returnvalue)

    // Emit the 'updatedNode' event to all connected clients
    io.emit('updatedNode', { id: returnvalue, data })
  })

  // Socket.IO connection handling
  io.on('connection', async socket => {
    console.log('a user connected')

    socket.on('getWorldState', async callback => {
      try {
        const getWorldState = (await import('./getWorldState.cjs')).default

        // Get the world state from the database
        const worldState = await getWorldState()

        // If callback is provided, return world state to client
        if (callback && typeof callback === 'function') {
          callback(worldState)
        }
      } catch (error) {
        console.error(error)
      }
    })

    // Listen for 'addJob' event from client
    socket.on('addJob', async (props, callback) => {
      try {
        console.log('addJob event received', props)

        // Extract job and data from props
        const { job, data = {} } = props

        // Check if job is valid
        if (!job) {
          throw new Error('Invalid job')
        }

        // Check if job exists in jobs object
        if (!jobs[job]) {
          throw new Error(`Job ${job} does not exist`)
        }

        // Add job to the queue
        const result = await jobs[job](data)

        // If callback is provided, return job info to client
        if (callback && typeof callback === 'function') {
          callback(result)
        }
      } catch (error) {
        console.error(error)
      }
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    console.log(`BullMQ Dashboard accessible at http://localhost:${port}`)
  })
}

main()
