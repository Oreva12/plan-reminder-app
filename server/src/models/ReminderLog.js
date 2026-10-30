const mongoose = require('mongoose');

const reminderLogSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    intervalDays: {
      type: Number,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      required: true,
    },
    error: {
      type: String,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// CRITICAL: This index prevents duplicate reminders for the same cycle
reminderLogSchema.index({ plan: 1, expiryDate: 1, intervalDays: 1 }, { unique: true });

module.exports = mongoose.model('ReminderLog', reminderLogSchema);