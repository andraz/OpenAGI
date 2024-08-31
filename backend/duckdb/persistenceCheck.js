import getDbInstance from './dbSingleton.js'

// Do a persistence check by writing timestamp to a test table
export default async () => {
  try {
    const db = await getDbInstance()

    await db.all('CREATE TABLE IF NOT EXISTS test (timestamptz TIMESTAMPTZ)')
    await db.all('INSERT INTO test (timestamptz) VALUES (NOW())')

    // Print current database time
    const dbTime = await db.all('SELECT NOW()')
    console.log('db time', dbTime)

    // Check if data was persisted after restart up to 5 rows
    const testRows = await db.all(
      'SELECT timestamptz FROM test ORDER BY timestamptz DESC LIMIT 5'
    )
    console.log('db persistance check', testRows)
  } catch (error) {
    console.error('Failed to perform persistence check:', error)
  }
}
