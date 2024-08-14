import Redis from 'ioredis'

const getRedisClient = () => new Redis()

export default getRedisClient
