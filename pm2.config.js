const { watch } = require("fs");

module.exports = {
  interpreter: "/usr/local/bin/bun",
  apps: [
    {
      name: "react-frontend", // React vite app running in dev mode
      cwd: "./frontend", // Set the working directory to frontend
      script: "bun run dev",
    },

    {
      name: "main-server", // Main server hosting /bull dashboard and / UI dev build
      cwd: "./backend", // Set the working directory to frontend
      script: "index.cjs",
    },

    {
      name: "worker", // Handles workers processing jobs from the queue
      cwd: "./backend", // Set the working directory to frontend
      script: "workers/index.js", // Path to worker entry point
      instances: "4", // Number of worker instances to run in parallel
      exec_mode: "cluster", // Run in cluster mode for parallel processing
    },
  ],
};
