const { test } = require('node:test');
const assert = require('node:assert');
const { getDueIntervals } = require('../src/services/reminderService');

// Helper to generate dates relative to a fake "today"
const daysFromNow = (days, baseDate) => {
  const d = new Date(baseDate);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};

test('getDueIntervals returns matching intervals', () => {
  const now = new Date('2026-11-01T12:00:00Z');
  
  // Plan expires in 7 days, category has [30, 7, 1]
  const plan = {
    cancelledAt: null,
    expiryDate: daysFromNow(7, now), 
    category: { reminderDays: [30, 7, 1] }
  };

  const due = getDueIntervals(plan, now);
  assert.deepStrictEqual(due, [7]); // Should only return 7
});

test('getDueIntervals returns empty array on non-reminder days', () => {
  const now = new Date('2026-11-01T12:00:00Z');
  
  // Plan expires in 6 days, category has [30, 7, 1]
  const plan = {
    cancelledAt: null,
    expiryDate: daysFromNow(6, now),
    category: { reminderDays: [30, 7, 1] }
  };

  const due = getDueIntervals(plan, now);
  assert.deepStrictEqual(due, []); // 6 is not in the array
});

test('getDueIntervals ignores cancelled plans', () => {
  const now = new Date('2026-11-01T12:00:00Z');
  
  // Plan expires in 7 days (which matches), but is cancelled
  const plan = {
    cancelledAt: new Date(),
    expiryDate: daysFromNow(7, now),
    category: { reminderDays: [30, 7, 1] }
  };

  const due = getDueIntervals(plan, now);
  assert.deepStrictEqual(due, []);
});

test('getDueIntervals handles multiple matches if data has duplicates', () => {
  // (Edge case: what if category has [7, 7]? The filter handles it naturally)
  const now = new Date('2026-11-01T12:00:00Z');
  const plan = {
    cancelledAt: null,
    expiryDate: daysFromNow(7, now),
    category: { reminderDays: [7, 7, 1] }
  };
  const due = getDueIntervals(plan, now);
  assert.deepStrictEqual(due, [7, 7]);
});