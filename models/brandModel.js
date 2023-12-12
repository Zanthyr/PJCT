const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    // gekoppeld aan company dmv Brandowner ID
    brandName: {
      type: String,
      required: [true, 'A brand must have a name'],
    },
    productGroup: {
      type: String,
    },
    brandOwner: {
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

brandSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'brandOwner',
    select: 'companyName',
  });
  next();
});

// dont return deactivated accounds when 'find' query
brandSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
