import fs from 'fs'
import path from 'path'

const jobs = {}

fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.js') {
    const jobName = path.basename(file, '.js')
    jobs[jobName] = require(`./${file}`).default
  }
})

export default jobs
