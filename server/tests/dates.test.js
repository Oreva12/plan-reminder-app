const { test } = require('node:test');
const assert = require('node:assert');
const { daysLeft, toUTCMidnight } = require('../src/utils/dates');

test('daysLeft returns 0 for today regardless of time', () => {
  const now = new Date('2026-10-29T08:00:00Z'); // Morning
  const expiryToday = new Date('2026-10-29T23:59:59Z'); // Late night
  
  assert.strictEqual(daysLeft(expiryToday, now), 0);
});

test('daysLeft returns 1 for tomorrow', () => {
  const now = new Date('2026-10-29T23:00:00Z');
  const tomorrow = new Date('2026-10-30T01:00:00Z');
  
  assert.strictEqual(daysLeft(tomorrow, now), 1);
});

test('daysLeft returns -1 for yesterday', () => {
  const now = new Date('2026-10-29T12:00:00Z');
  const yesterday = new Date('2026-10-28T12:00:00Z');
  
  assert.strictEqual(daysLeft(yesterday, now), -1);
});