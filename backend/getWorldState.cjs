/**
 * Returns the world state from the database.
 * @returns {Promise<Object>} The world state.
 */
const getWorldState = async () => {
  let client = null
  try {
    const getClient = (await import('./workers/client/pg.js')).getClient

    // Get a client from the pool
    client = await getClient()

    // Query the database
    const query = 'SELECT * FROM world_state'
    const res = await client.query(query)

    // Return the world state
    return res.rows
  } catch (error) {
    // Log the error
    console.error(error)
    throw error
  } finally {
    if (client) {
      client.release()
    }
  }
}

module.exports = getWorldState

// CLI test
if (require.main === module) {
  getWorldState()
    .then(console.log)
    .catch(console.error)
    .finally(() => process.exit(0))
}
