const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: [true, 'A color must have a name'],
    },
    ColorVersion: {
      type: Number,
      default: 0,
    },
    colorType: {
      type: String,
      enum: ['BrandColor', 'SpotColor'],
      default: 'BrandColor',
      required: [true, 'A color must have a type'],
    },
    brandName: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    values: [
      {
        cie_L: Number,
        cie_a: Number,
        cie_b: Number,
        deltae00: Number,
        delta_c: Number,
        delta_h: Number,
        hex: String,
      },
    ],
    createdByUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    createdByCompany: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
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
    path: 'createdByUser',
    select: 'userName',
  }).populate({
    path: 'brandName',
  });
  next();
});

colorSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'createdByCompany',
    select: 'companyName',
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
