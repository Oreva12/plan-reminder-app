const env = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const app = require('./app');
const { startDailyReminder } = require('./jobs/dailyReminder');

async function start() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Server on http://localhost:${env.PORT}`);
    console.log(`   Health: http://localhost:${env.PORT}/health`);
    console.log(`   Env:    ${env.NODE_ENV} | TZ: ${env.CRON_TZ}`);
  });

  const stopCron = startDailyReminder();

  const shutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('💥 Startup failed:', err);
  process.exit(1);
});