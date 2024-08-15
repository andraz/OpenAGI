import getPgClient from '../client/pg.js'

/**
 * Sets the node in PostgreSQL world state with the given key and value.
 * @param {Object} job - The job object containing the data.
 * @param {Object} job.data - The job payload.
 * @param {string} job.data.nodeId - The ID of the node to set.
 * @param {Object} job.data.data - The data to set for the node.
 */
const main = async job => {
  try {
    console.log('PROCESSING setNodeState', job)

    // Get the PostgreSQL client
    const pgClient = await getPgClient()

    // Execute the SQL query to set the node in the world state
    await pgClient.query
      `INSERT INTO world_state (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE
        SET data = data || $2`, // Merge the data if the node already exists
      [job.data.nodeId, job.data.data]
    )
  } catch (error) {
    // Log any errors that occur during the execution of the command
    console.error('Error executing command:', error)

    // Rethrow the error to be handled by the caller
    throw error
  }
}
