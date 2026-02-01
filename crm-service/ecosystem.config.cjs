module.exports = {
  apps: [
    {
      name: "crm-service",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
