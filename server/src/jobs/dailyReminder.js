const cron = require('node-cron');
const env = require('../config/env');
const { runReminders } = require('../services/reminderService');

function startDailyReminder() {
  // Run every day at 8:00 AM in the configured timezone
  // '0 8 * * *' means: minute 0, hour 8, every day
  cron.schedule('0 8 * * *', async () => {
    try {
      await runReminders();
    } catch (err) {
      console.error('❌ Cron job failed:', err);
    }
  }, {
    timezone: env.CRON_TZ,
  });

  console.log(`⏰ Daily reminder scheduled for 8:00 AM ${env.CRON_TZ}`);
}

module.exports = { startDailyReminder };