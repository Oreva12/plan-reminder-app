const { daysLeft } = require('./dates');

const EXPIRING_THRESHOLD_DAYS = 7;

function getPlanStatus(plan, now = new Date()) {
  if (plan.cancelledAt) return 'cancelled';
  
  const days = daysLeft(plan.expiryDate, now);
  
  if (days < 0) return 'expired';
  if (days <= EXPIRING_THRESHOLD_DAYS) return 'expiring';
  return 'active';
}

module.exports = {
  getPlanStatus,
  EXPIRING_THRESHOLD_DAYS
};