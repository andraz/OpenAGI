/**
 * Retrieves a node from the database by its ID.
 * @param {string} id - The ID of the node to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the node with the given ID.
 * @throws {Error} If an error occurs while retrieving the node.
 */
const getNodeById = async id => {
  // Import the getClient function from the pg.js file in the workers/client directory.
  const getClient = (await import('./workers/client/pg.js')).getClient

  let client = null
  try {
    // Get a client from the connection pool.
    client = await getClient()

    // Define the SQL query to retrieve the node with the given ID.
    const query = 'SELECT data FROM world_state WHERE id = $1'

    // Execute the query with the given ID as a parameter.
    const result = await client.query(query, [id])

    // Return the first row of the result set, which should be the node with the given ID.
    return result.rows[0].data
  } catch (error) {
    // If an error occurs, log it to the console and rethrow it.
    console.error(error)
    throw error
  } finally {
    // If a client was acquired, release it back to the connection pool.
    if (client) {
      client.release()
    }
  }
}

// Export the getNodeById function so it can be used by other modules.
module.exports = getNodeById
