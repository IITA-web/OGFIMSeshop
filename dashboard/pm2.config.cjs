module.exports = {
  apps: [
    {
      name: "ogfims-admin",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: true,
      env: {
        NODE_ENV: "prod",
        PORT: 3001,
      },
    },
  ],
};
