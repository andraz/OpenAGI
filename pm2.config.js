module.exports = {
  interpreter: '/usr/local/bin/bun', // Path to the Bun interpreter
  apps: [
    {
      name: 'OpenAGI-server', // Main server running on port 4444
      script: './backend/index.js',
    },

    // {
    //   name: 'bullmq', // Dashboard for BullMQ running on port 3000
    //   script: './bullmqDashboard.cjs',
    // },

    // {
    //   name: 'worker', // Worker for BullMQ
    //   script: './workers/index.js', // Path to worker entry point
    //   instances: '4', // Number of worker instances to run in parallel
    //   exec_mode: 'cluster', // Run in cluster mode for parallel processing
    // },
  ],
}
