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
    colorType: {
      type: String,
      enum: ['BrandColor', 'SpotColor', 'SystemColor'],
      default: 'BrandColor',
    },
    brandName: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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

colorSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: 'userName',
  }).populate({
    path: 'brandName',
  });
  next();
});

// dont return deactivated accounds when 'find' query
colorSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Color = mongoose.model('Color', colorSchema);

module.exports = Color;