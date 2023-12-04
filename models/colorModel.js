const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: [true, 'A color must have a name'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
