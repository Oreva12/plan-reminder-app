const { test } = require('node:test');
const assert = require('node:assert');
const { getPlanStatus } = require('../src/utils/planStatus');

// Helper to generate a future date
const daysFromNow = (days) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};

test('cancelledAt overrides everything', () => {
  const plan = { expiryDate: daysFromNow(-10), cancelledAt: new Date() };
  assert.strictEqual(getPlanStatus(plan), 'cancelled');
});

test('returns expired for yesterday', () => {
  const plan = { expiryDate: daysFromNow(-1), cancelledAt: null };
  assert.strictEqual(getPlanStatus(plan), 'expired');
});

test('returns expiring for today and boundaries', () => {
  // Today (0 days)
  assert.strictEqual(getPlanStatus({ expiryDate: daysFromNow(0) }), 'expiring');
  // Exactly on the threshold (7 days)
  assert.strictEqual(getPlanStatus({ expiryDate: daysFromNow(7) }), 'expiring');
});

test('returns active outside threshold', () => {
  // 1 day past threshold (8 days)
  assert.strictEqual(getPlanStatus({ expiryDate: daysFromNow(8) }), 'active');
});