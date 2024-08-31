import express from 'express'

import getDbInstance from './dbSingleton.js'
import persistenceCheck from './persistenceCheck.js'
import setupH3Extension from './setupH3Extension.js'
import errorHandler from './errorHandler.js'

const app = express()
const port = 5555

// Endpoint to test parsing an H3 index
app.get('/parse/:h3Index', async (req, res) => {
  const h3Index = req.params.h3Index
  console.time('query')

  const db = await getDbInstance()

  const dbAllResponse = await db.all('SELECT h3_string_to_h3($1) AS h3', [
    h3Index,
  ])
  console.timeEnd('query')
  console.log(dbAllResponse)
  res.send(dbAllResponse)
})

// Endpoint to get the H3 polygon
app.get('/polygon/:h3Index', async (req, res) => {
  const { h3Index } = req.params
  console.time('query')

  const db = await getDbInstance()

  const dbAllResponse = await db.all(
    'SELECT h3_cell_to_boundary_wkt(h3_string_to_h3($1)) AS polygon',
    [h3Index]
  )
  console.timeEnd('query')
  console.log(dbAllResponse)
  res.status(200).json(dbAllResponse)
})

// Apply the middleware globally
app.use(errorHandler)

app.listen(port, async () => {
  // Initialize the database connection when server starts
  const db = await getDbInstance()

  // Sanity check
  if (!db) {
    console.error('Failed to initialize the database connection.')
    process.exit(1)
  }

  // Setup H3 extension when server starts
  await setupH3Extension()

  console.log(`DuckDB listening at http://localhost:${port}`)

  await persistenceCheck() // Perform persistence check after server starts
})

// Fix broken bigint conversion to prevent .json() throwing
BigInt.prototype.toJSON = function () {
  return this.toString()
}
