const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    // gekoppeld aan company dmv Brandowner ID
    brandName: {
      type: String,
      required: [true, 'A job must have a name']
    },
    productGroup: {
      type: [Array]
    },
    CreatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
