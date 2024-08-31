// Global error handling middleware
export default (err, req, res, next) => {
  console.error('Error caught:', err)
  res.status(500).send(`Internal server error: ${err.message}`)
}
