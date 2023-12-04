const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'A Company must have a name']
    },
    companyType: {
      type: String,
      enum: ['Printer', 'PrePress', 'BrandOwner'],
      default: 'Printer'
    },
    adressLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    companyCreatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
