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
      name: "socket", // Main socketio server also hosting /bull dashboard
      cwd: "./backend", // Set the working directory to frontend
      script: "index.cjs",
    },

    {
      name: "duckdb", // DuckDB API server
      cwd: "./backend/duckdb", // Set the working directory to frontend
      script: "index.js", // Path to DuckDB API entry point
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
