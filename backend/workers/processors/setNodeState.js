import { getClient } from '../client/pg.js'

/**
 * Updates the node in PostgreSQL world state with the data provided.
 * @param {Object} job - The job object containing the data.
 * @param {Object} job.data - The data payload.
 * @param {string} job.data.id - The UUID of the node to set.
 */
const main = async job => {
  try {
    // Split the data into the id and the rest of the data
    const { id, ...data } = job.data

    // Sanity check if id is UUID format
    if (
      !id?.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      )
    ) {
      throw new Error('job.data.id is not in UUID format')
    }

    // Convert the data object to a JSON string
    const dataJson = JSON.stringify(data)

    // Create an array of values to be inserted into the SQL query
    const values = [id, dataJson]
    console.log('Query data:', values)

    // Prepare SQL query and values, data will be merged with existing data if it exists
    const sql = `
      INSERT INTO public.world_state (id, data)
      VALUES ($1::uuid, $2::jsonb)
      ON CONFLICT (id) 
      DO UPDATE SET data = world_state.data || EXCLUDED.data
      RETURNING id`

    // Get the client
    const pgClient = await getClient()

    // Time the query execution
    console.time('Query execution')
    const queryResult = await Promise.race([
      pgClient.query(sql, values),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), 10000)
      ),
    ])
    console.timeEnd('Query execution')

    // Close the client
    await pgClient.end()

    // We should get back the id of the inserted/updated row
    const re = queryResult?.rows?.[0]?.id

    // Return the id of the inserted/updated row
    return re
  } catch (error) {
    console.error('Error in main function:', error)
    if (error.code) {
      console.error('Error code:', error.code)
    }
    if (error.detail) {
      console.error('Error detail:', error.detail)
    }
    throw error
  }
}

export default main
