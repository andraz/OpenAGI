import dotenv from 'dotenv'
import Redis from 'ioredis'

// Function to get a new PostgreSQL client
import pkg from 'pg'
const { Pool } = pkg

let pool

export const getClient = async () => {
  if (!pool) {
    // Load environment variables
    const { parsed } = dotenv.config({ path: '../.env' })

    pool = new Pool({
      user: parsed.POSTGRES_USER,
      password: parsed.POSTGRES_PASSWORD,
      host: parsed.POSTGRES_HOST,
      port: parsed.POSTGRES_PORT,
      database: parsed.POSTGRES_DATABASE,
      connectionTimeoutMillis: 5000, // 5 seconds timeout
    })
  }

  try {
    const client = await pool.connect()
    const { rows } = await client.query('SELECT NOW()')
    console.log('Connected to database at:', rows[0].now)
    return client
  } catch (err) {
    console.error('Error connecting to the database:', err)
    throw err
  }
}

// Create a new Redis client
const redisClient = new Redis()
/**
 * Retrieves keys of a specified type from the database.
 *
 * This function establishes a connection to the database, executes a SQL query to fetch keys of a specified type,
 * and then closes the connection. The keys are extracted from the query result and returned as an array.
 *
 * @async
 * @function
 * @param {string} type - The type of keys to retrieve.
 * @returns {Promise<string[]>} A promise that resolves to an array of keys.
 */
const getKeysByType = async type => {
  const client = getClient()
  await client.connect()

  const query = `
    SELECT
      subquery.data ->> 'key' as key
    FROM
      (
        SELECT
          unnest("apiKeys") as data
        FROM
          public.persona
      ) as subquery
       WHERE
          subquery.data ->> 'type' = $1
  `

  const result = await client.query(query, [type])
  await client.end()

  return result.rows.map(row => row.key)
}

// Cache OpenRouter keys in Redis
const cacheOpenRouterKeys = async () => {
  const keys = await getKeysByType('openrouter')
  // Set keys to expire after 1 hour (3600 seconds)
  await redisClient.setex('openRouterKeys', 3600, JSON.stringify(keys))
}

// Retrieve OpenRouter keys from Redis cache
const getCachedOpenRouterKeys = async () => {
  const cachedKeys = await redisClient.get('openRouterKeys')
  return cachedKeys ? JSON.parse(cachedKeys) : []
}

// Use a single key of OpenRouter keys retrieved from the database
export const useOpenRouterKey = async () => {
  // Try to retrieve OpenRouter keys from Redis cache
  let openRouterKeys = await getCachedOpenRouterKeys()

  // If no keys are found in the cache, retrieve them from the database and cache them
  if (openRouterKeys.length === 0) {
    openRouterKeys = await getKeysByType('openrouter')
    await cacheOpenRouterKeys(openRouterKeys)
  }

  // Select a random key from the list of OpenRouter keys
  const randomIndex = Math.floor(Math.random() * openRouterKeys.length)
  const selectedKey = openRouterKeys[randomIndex]
  return selectedKey
}
