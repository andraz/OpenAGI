const express = require('express')
const { createBullBoard } = require('@bull-board/api')
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter')
const { ExpressAdapter } = require('@bull-board/express')
const http = require('http')
const { Server } = require('socket.io')

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
  const queues = workerList.map(worker => new BullMQAdapter(getQueue(worker)))

  const serverAdapter = new ExpressAdapter()
  createBullBoard({ queues, serverAdapter })
  serverAdapter.setBasePath('/')
  app.use('/', serverAdapter.getRouter())

  // Socket.IO connection handling
  io.on('connection', socket => {
    console.log('a user connected')

    // // Emit time to client every second
    // setInterval(() => {
    //   // Get hh:mm:ss format in 24 hour time without AM PM indicator
    //   const time = new Date().toLocaleTimeString('en-US', { hour12: false })
    //   // Emit the time to all connected clients
    //   io.emit('time', time)
    // }, 1000)

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
