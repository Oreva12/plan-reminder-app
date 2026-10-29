const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Normalizes any date input to UTC midnight.
 */
function toUTCMidnight(dateInput) {
  const d = new Date(dateInput);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * Returns whole days between today and the expiry date.
 * Returns 0 for today, 1 for tomorrow, -1 for yesterday.
 */
function daysLeft(expiryDate, now = new Date()) {
  const expiryMidnight = toUTCMidnight(expiryDate);
  const todayMidnight = toUTCMidnight(now);
  
  const diffMs = expiryMidnight.getTime() - todayMidnight.getTime();
  return Math.round(diffMs / MS_PER_DAY);
}

module.exports = {
  toUTCMidnight,
  daysLeft
};