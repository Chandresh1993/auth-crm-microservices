module.exports = {
  apps: [
    {
      name: "auth-service",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3020,
      },
    },
  ],
};
