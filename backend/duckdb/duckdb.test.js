import { Database } from 'duckdb'
import getDbInstance from './dbSingleton'

let db

const executeQuery = query => {
  return new Promise((resolve, reject) => {
    db.all(query, (err, res) => {
      if (err) {
        console.warn(err)
        return reject(err)
      }

      console.log({
        query,
        res,
      })

      return resolve(res)
    })
  })
}

beforeAll(async () => {
  // Connect to the database

  // Testing local engine for rapid sanity check, use remote db instance to test the remote engine
  db = new Database(':memory:')
  // db = await getDbInstance()

  // Load the H3 extension
  await db.exec('INSTALL h3')
  await db.exec('LOAD h3')
})

test('string_to_h3', async () => {
  const query = `SELECT h3_string_to_h3('85283473fffffff') AS h3`
  const result = await executeQuery(query)
  expect(result[0].h3).toEqual(599686042433355775n)
})

test('latlng_to_cell', async () => {
  const query = 'SELECT h3_latlng_to_cell(130, 30, 0) AS cell'
  const result = await executeQuery(query)
  expect(result[0].cell).toBe(576988517884755967n)
})

test('cell_to_lat', async () => {
  const query = `SELECT h3_cell_to_lat(h3_string_to_h3('85283473fffffff')) AS lat`
  const result = await executeQuery(query)
  expect(result[0].lat).toBeCloseTo(37.345793375368)
})

test('cell_to_lng', async () => {
  const query = `SELECT h3_cell_to_lng(h3_string_to_h3('85283473fffffff')) AS lng`
  const result = await executeQuery(query)
  expect(result[0].lng).toBeCloseTo(-121.976375972551)
})

test('cell_to_boundary_wkt', async () => {
  const query = `SELECT h3_cell_to_boundary_wkt(h3_string_to_h3('89283082807fff')) AS polygon`
  const result = await executeQuery(query)
  expect(result[0].polygon).toEqual(
    'POLYGON ((-112.071657 -14.209046, -112.075368 -14.211199, -112.075441 -14.215840, -112.071802 -14.218328, -112.068090 -14.216175, -112.068017 -14.211534, -112.071657 -14.209046))'
  )
})
