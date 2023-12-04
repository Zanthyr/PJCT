const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobName: {
      type: String,
      required: [true, 'A job must have a name']
    },
    jobDescription: {
      type: String
    },
    designImage: {
      type: String,
      required: [true, 'A tour must have a design image']
    },
    jobCreator: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: [true, 'A job must have a creator (company ID)']
    },
    printers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Company'
      }
    ],
    colors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Color'
      }
    ],
    jobCreatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
