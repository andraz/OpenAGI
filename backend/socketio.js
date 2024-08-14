import fastify from 'fastify'
import fastifyIO from 'fastify-socket.io'

const server = fastify()
server.register(fastifyIO)

server.get('/', (req, reply) => {
  server.io.emit('hello')
})

server.ready().then(() => {
  console.log('server is ready')

  // we need to wait for the server to be ready, else `server.io` is undefined
  server.io.on('connection', socket => {
    console.log('a user connected')
    // ...
  })
})

server.listen({ port: 5555 })
