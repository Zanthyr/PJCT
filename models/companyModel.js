const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: [true, 'A Company must have a name'],
    },
    companyType: {
      type: String,
      enum: ['Printer', 'PrePress', 'BrandOwner'],
      default: 'Printer',
    },
    adressLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    companyPhoto: {
      type: String,
      default: 'default.jpg',
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
companySchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
