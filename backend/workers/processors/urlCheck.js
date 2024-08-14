import https from 'https'
import http from 'http'

/**
 * Main function to check the reachability of a domain using a GET request.
 *
 * @param {Object} job - The job object containing the data.
 * @param {string} job.data.url - The URL of the domain to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the GET request is successful, and false otherwise.
 * @throws {Error} Throws an error if the url is not provided in the job data.
 */
const main = async job => {
  try {
    // Destructure the url from the job data
    const { url } = job.data

    // If the url is not provided, throw an error
    if (!url) {
      throw new Error('url is required')
    }

    // Use the checkDomainReachabilityWithGetRequest function to check if the domain is reachable
    const alive = await checkDomainReachabilityWithGetRequest(url)

    // Return the result of the reachability check
    return alive
  } catch (error) {
    // Log any errors that occur during the execution of the command
    console.error('Error executing command:', error)

    // Rethrow the error to be handled by the caller
    throw error
  }
}

/**
 * Check the reachability of a domain using a GET request.
 *
 * @param {string} url - The URL of the domain to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the GET request is successful, and false otherwise.
 */
const checkDomainReachabilityWithGetRequest = url => {
  // Return a new Promise that resolves to true if the GET request is successful, and false otherwise
  return new Promise(resolve => {
    // Determine the protocol of the URL
    const protocol = url.startsWith('https') ? https : http

    // Make a GET request to the specified url
    const req = protocol.get(url, res => {
      // If the request is successful, resolve the Promise to true and destroy the request
      resolve(true)
      req.destroy()
    })

    // If an error occurs during the request, resolve the Promise to false
    req.on('error', err => {
      resolve(false)
    })

    // If the request takes longer than 5 seconds, resolve the Promise to false and destroy the request
    req.setTimeout(5000, () => {
      resolve(false)
      req.destroy()
    })
  })
}

// Export the main function as the default export of this module
export default main
