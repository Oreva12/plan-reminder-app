const Plan = require('../models/Plan');
const ReminderLog = require('../models/ReminderLog');
const Category = require('../models/Category');
const { daysLeft } = require('../utils/dates');
const { sendEmail } = require('./emailService');
const env = require('../config/env');

function getDueIntervals(plan, now = new Date()) {
  // If the plan is cancelled, we don't send reminders
  if (plan.cancelledAt) return [];

  const days = daysLeft(plan.expiryDate, now);

  // The category holds the array of reminderDays (e.g., [30, 14, 7, 3, 2, 1])
  // Note: We expect the plan object to have the 'category' populated before calling this.
  const intervals = plan.category?.reminderDays || [];

  // Return only the intervals that match exactly how many days are left
  return intervals.filter((interval) => interval === days);
}

/**
 * Checks if we already successfully sent this specific interval for this expiry date.
 */
async function shouldSendReminder(plan, intervalDays) {
  const existingLog = await ReminderLog.findOne({
    plan: plan._id,
    expiryDate: plan.expiryDate,
    intervalDays,
    status: 'sent', // Only skip if it was successfully sent
  });

  return !existingLog; // If no log exists, we SHOULD send it.
}

async function runReminders(now = new Date()) {
  console.log(`⏰ Running reminders for ${now.toISOString()}`);

  const plans = await Plan.find({ cancelledAt: null })
    .populate('category', 'name reminderDays');

  let sentCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const plan of plans) {
    const dueIntervals = getDueIntervals(plan, now);
    
    for (const interval of dueIntervals) {
      const shouldSend = await shouldSendReminder(plan, interval);
      if (!shouldSend) {
        skipCount++;
        continue;
      }

      try {
        const daysLeftCount = daysLeft(plan.expiryDate, now);
        const subject = `Reminder: ${plan.name} expires in ${daysLeftCount} days`;
        const text = `Your plan "${plan.name}" (provider: ${plan.provider}) expires in ${daysLeftCount} days.`;

        await sendEmail({ to: env.SHARED_INBOX, subject, text });

        // Upsert success log
        await ReminderLog.findOneAndUpdate(
          { plan: plan._id, expiryDate: plan.expiryDate, intervalDays: interval },
          { status: 'sent', recipient: env.SHARED_INBOX, sentAt: new Date(), error: null },
          { upsert: true }
        );

        console.log(`📧 Sent: ${plan.name} (${interval}d)`);
        sentCount++;
      } catch (error) {
        // Upsert failure log
        await ReminderLog.findOneAndUpdate(
          { plan: plan._id, expiryDate: plan.expiryDate, intervalDays: interval },
          { status: 'failed', recipient: env.SHARED_INBOX, sentAt: new Date(), error: error.message || String(error) },
          { upsert: true }
        );
        console.error(`❌ Failed: ${plan.name} (${interval}d) — ${error.message || error}`);
        failCount++;
      }
    }
  }

  console.log(`✅ Reminders complete: ${sentCount} sent, ${skipCount} skipped, ${failCount} failed`);
  return { sentCount, skipCount, failCount };
}

module.exports = {
  getDueIntervals,
  shouldSendReminder,
  runReminders, // <-- NEW
};