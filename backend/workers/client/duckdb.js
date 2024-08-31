import fetch from 'node-fetch'

const client = async url => {
  try {
    // Make a GET request to the server
    const response = await fetch('http://localhost:5555/' + url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Parse the JSON response
    const data = await response.json()

    // Return the data
    return data
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

export default client

// for CLI testing
if (require.main === module) {
  // IIFE to call main immediately and log the result
  ;(async () => {
    console.time('fetch')
    const result = await client('parse/89283082807fff')
    console.timeEnd('fetch')
    console.log(result)

    console.time('fetch')
    const result2 = await client('polygon/89283082807fff')
    console.timeEnd('fetch')
    console.log(result2)
  })()
}
