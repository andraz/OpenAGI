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

  // Create an array of BullMQAdapter instances for each worker in the workerList
  const queues = workerList.map(worker => new BullMQAdapter(getQueue(worker)))

  const serverAdapter = new ExpressAdapter()
  createBullBoard({ queues, serverAdapter })
  serverAdapter.setBasePath('/admin/queues')
  app.use('/admin/queues', serverAdapter.getRouter())

  // Socket.IO connection handling
  io.on('connection', socket => {
    console.log('a user connected')

    // Emit time every 5 seconds
    setInterval(() => {
      // Get hh:mm:ss format in 24 hour time without AM PM indicator
      const time = new Date().toLocaleTimeString('en-US', { hour12: false })
      // Emit the time to all connected clients
      io.emit('time', time)
    }, 1000)

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    console.log(`BullMQ Dashboard accessible at /admin/queues`)
  })
}

main()
