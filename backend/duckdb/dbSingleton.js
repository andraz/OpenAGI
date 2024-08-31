import { Database } from 'duckdb-async'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })

let dbInstance = null

const initDb = async () => {
  const connectionString =
    'md:' +
    process.env.MOTHERDUCK_DATABASE +
    '?motherduck_token=' +
    process.env.MOTHERDUCK_TOKEN

  dbInstance = await Database.create(connectionString)
}

const getDbInstance = async () => {
  if (!dbInstance) {
    await initDb()
  }
  return dbInstance
}

export default getDbInstance
