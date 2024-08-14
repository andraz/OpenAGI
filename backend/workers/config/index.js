import dotenv from 'dotenv'
import workerConfig from './worker.js'
import redisConfig from './redis.js'
import jobConfig from './job.js'

dotenv.config()

export default {
  redis: redisConfig,
  worker: workerConfig,
  job: jobConfig,
}
