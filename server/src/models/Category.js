const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    reminderDays: {
      type: [Number], // Array of integers, e.g., [30, 14, 7]
      required: true,
      default: [7, 1], // Default reminder policy
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);