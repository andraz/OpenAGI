module.exports = {
  interpreter: "/usr/local/bin/bun",
  apps: [
    {
      name: "react-frontend", // React vite app running in dev mode
      script: "cd frontend && bun run dev",
    },

    {
      name: "main-server", // Main server hosting /bull dashboard and / UI dev build
      script: "./backend/index.cjs",
    },

    {
      name: "worker", // Handles workers processing jobs from the queue
      script: "./backend/workers/index.js", // Path to worker entry point
      instances: "4", // Number of worker instances to run in parallel
      exec_mode: "cluster", // Run in cluster mode for parallel processing
    },
  ],
};
