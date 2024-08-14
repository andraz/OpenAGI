import redisConfig from './redis.js'

export default {
  // Redis connection config
  connection: redisConfig,

  // When a job is processed, it is moved to the "completed" set, which is cleaned up every 1 hour
  removeOnComplete: {
    age: 3600, // keep up to 1 hour of logs
    count: 1000, // keep up to 1000 logs
  },

  // When a job fails, it is moved to the "failed" set, which is cleaned up every 24 hours
  removeOnFail: {
    age: 24 * 3600, // keep up to 24 hours
  },

  // Run up to 10 jobs at the same time per worker
  concurrency: 10,

  // Execute each worker process in a separate thread
  useWorkerThreads: true,
}
