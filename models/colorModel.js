const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: [true, 'A color must have a name'],
    },
    ColorVersion: {
      type: Number,
      default: 1,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// dont return deactivated accounds when 'find' query
colorSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
