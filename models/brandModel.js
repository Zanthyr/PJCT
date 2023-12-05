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
      required: [true, 'A Barnd must have a company'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
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

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
