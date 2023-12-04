const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'A job must have a name']
    },
    companType: {
      type: String
    },
    // adress  - geo
    // brands?
    jobCreatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
