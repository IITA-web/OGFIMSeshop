module.exports = {
  apps: [
    {
      name: 'ogfims-api',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: true,
      // merge_logs: true,
      // max_memory_restart: '300M',
      env: {
        NODE_ENV: 'prod',
        PORT: 3000,
      },
    },
  ],
};
